"use client";

import { Suspense, useEffect } from "react";
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

  // Forward the landing URL's query string (utm_source / utm_medium /
  // utm_campaign / utm_term / utm_content, gclid, ...) to the GHL-hosted form
  // so attribution survives the iframe hop. Read via `useSearchParams` inside a
  // Suspense boundary so the value is present on the very first render of the
  // iframe — no hydration mismatch and no second iframe load.
  const forward = searchParams.toString();
  const src = `${GHL_FORM_BASE}${formId}${forward ? `?${forward}` : ""}`;

  useEffect(() => {
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
  }, []);

  return (
    <div className="w-full">
      <div style={{ height }}>
        <iframe
          src={src}
          style={{ width: "100%", height: "100%", border: "none", borderRadius: "8px" }}
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
      </div>
      <LegalLinks lead="Submitting this form means you agree to our" className="mt-3 text-center" />
    </div>
  );
}

export function GhlFormEmbed(props: GhlFormEmbedProps) {
  return (
    <Suspense
      fallback={
        <div className="w-full">
          <div style={{ height: props.height }} aria-hidden="true" />
        </div>
      }
    >
      <GhlFormEmbedInner {...props} />
    </Suspense>
  );
}
