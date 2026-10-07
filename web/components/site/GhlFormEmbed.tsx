"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { LegalLinks } from "@/components/site/LegalLinks";

const GHL_EMBED_JS = "https://links.precisiondatastrategies.com/js/form_embed.js";
const GHL_EMBED_SCRIPT_ID = "ghl-form-embed-js";
const GHL_FORM_BASE = "https://links.precisiondatastrategies.com/widget/form/";

type GhlFormEmbedProps = {
  formId: string;
  formName: string;
  height: number;
  title?: string;
};

function GhlFormEmbedInner({ formId, formName, height, title }: GhlFormEmbedProps) {
  const searchParams = useSearchParams();
  const hostRef = useRef<HTMLDivElement | null>(null);
  // The embed is not free: form_embed.js + the leadconnector bundle are ~600 KB
  // and ~600 ms of scripting, and they set __cf_bm third-party cookies (the two
  // Lighthouse Best-Practice failures). Gate the whole thing on "about to be
  // seen" — the wrapper already reserves the exact height, so nothing shifts.
  const [active, setActive] = useState(false);

  // Forward the landing URL's query string (utm_source / utm_medium /
  // utm_campaign / utm_term / utm_content, gclid, ...) to the GHL-hosted form
  // so attribution survives the iframe hop. Read via `useSearchParams` inside a
  // Suspense boundary so the value is present on the very first render of the
  // iframe — no hydration mismatch and no second iframe load.
  const forward = searchParams.toString();
  const src = `${GHL_FORM_BASE}${formId}${forward ? `?${forward}` : ""}`;

  useEffect(() => {
    const node = hostRef.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setActive(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          setActive(true);
        }
      },
      // 800px lead-in: the form is loaded and ready before it scrolls into view.
      { rootMargin: "800px 0px" },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!active) return;

    const w = window as unknown as {
      __ghl_iframe_resizer_initialized__?: boolean;
      __ghl_widget_initialized__?: boolean;
    };
    const ran =
      w.__ghl_iframe_resizer_initialized__ === true ||
      w.__ghl_widget_initialized__ === true;

    if (document.getElementById(GHL_EMBED_SCRIPT_ID)) {
      // Script already on the page. If it has already run its one-time iframe
      // scan (e.g. this iframe mounted later inside a dialog), re-execute it so
      // the new iframe gets initialized — per-iframe guards make that safe.
      if (!ran) return;
      const rescan = document.createElement("script");
      rescan.src = GHL_EMBED_JS;
      rescan.setAttribute("data-ghl-rescan", "true");
      document.body.appendChild(rescan);
      return;
    }

    const script = document.createElement("script");
    script.id = GHL_EMBED_SCRIPT_ID;
    script.src = GHL_EMBED_JS;
    document.body.appendChild(script);
  }, [active]);

  return (
    <div ref={hostRef} style={{ minHeight: height }}>
      {active && (
        <iframe
          src={src}
          style={{ width: "100%", height, border: "none", borderRadius: "8px" }}
          id={`inline-${formId}`}
          data-layout="{'id':'INLINE'}"
          data-trigger-type="alwaysShow"
          data-trigger-value=""
          data-activation-type="alwaysActivated"
          data-activation-value=""
          data-deactivation-type="neverDeactivate"
          data-deactivation-value=""
          data-form-name={formName}
          data-height={String(height)}
          data-layout-iframe-id={`inline-${formId}`}
          data-form-id={formId}
          data-cookie-consent="true"
          data-cookie-consent-provider="auto"
          title={title ?? formName}
        />
      )}
    </div>
  );
}

export function GhlFormEmbed(props: GhlFormEmbedProps) {
  return (
    <div className="w-full">
      <Suspense
        fallback={
          <div style={{ height: props.height }} aria-hidden="true" />
        }
      >
        <GhlFormEmbedInner {...props} />
      </Suspense>
      <LegalLinks lead="Submitting this form means you agree to our" className="mt-3 text-center" />
    </div>
  );
}
