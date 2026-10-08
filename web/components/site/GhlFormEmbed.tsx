"use client";

import { Suspense, useEffect, useId, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { LegalLinks } from "@/components/site/LegalLinks";

const GHL_EMBED_JS = "https://links.precisiondatastrategies.com/js/form_embed.js";
const GHL_EMBED_SCRIPT_ID = "ghl-form-embed-js";
const GHL_FORM_BASE = "https://links.precisiondatastrategies.com/widget/form/";

/**
 * The TCPA/SMS consent label GHL renders inside its own form. It is repeated
 * here as first-party markup because the embed is a cross-origin iframe: bots
 * and compliance reviewers that fetch the raw HTML would otherwise never see
 * it. The wording must stay byte-identical to the GHL label.
 */
const TCPA_CONSENT_LINK_TEXT = "[View full consent terms]";
const TCPA_CONSENT_TEXT =
  "I agree to be contacted about my inquiry by call, text, or email, including by automated systems and prerecorded or artificial voice messages. ";
const TCPA_CONSENT_LABEL = `${TCPA_CONSENT_TEXT}${TCPA_CONSENT_LINK_TEXT}`;

type GhlFormEmbedProps = {
  formId: string;
  formName: string;
  height: number;
  title?: string;
  /**
   * Render the Privacy/Terms line directly under the embed (default). Dialogs
   * pass `false` and pin their own copy to a fixed foot, because a form that is
   * taller than the sheet would otherwise push the legal line off-screen.
   */
  showLegal?: boolean;
  legalClassName?: string;
  /**
   * Server-render a real TCPA consent checkbox and hold the embed back until it
   * is ticked. Without it the only consent control is inside the cross-origin
   * iframe, so a plain HTTP fetch of the page contains no consent markup at
   * all. The checkbox is a genuine gate, never a decorative one.
   */
  consent?: boolean;
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

  // GHL's resizer rewrites the iframe height once the form is measured
  // (824px of desktop markup renders ~1005px at 390px wide, and it can shrink
  // on other layouts too). `min-height` on the host is only a floor, so a
  // shorter iframe would leave a blank gap between the form and the legal
  // line. Track the real box so the line always sits directly under the form.
  useEffect(() => {
    if (!active) return;
    const node = hostRef.current;
    if (!node || typeof ResizeObserver === "undefined") return;
    const frame = node.querySelector("iframe");
    if (!frame) return;
    const sync = () => {
      const h = frame.getBoundingClientRect().height;
      if (h > 0) node.style.minHeight = `${Math.round(h)}px`;
    };
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(frame);
    return () => ro.disconnect();
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

export function GhlFormEmbed({
  showLegal = true,
  legalClassName = "mt-3 text-center",
  consent = false,
  ...props
}: GhlFormEmbedProps) {
  const consentId = useId();
  const [agreed, setAgreed] = useState(false);
  // With `consent` on, nothing from GHL is mounted — no iframe, no third-party
  // script — until the visitor has ticked the box.
  const showEmbed = !consent || agreed;

  return (
    <div className="w-full">
      {consent && (
        <div className="mb-4 rounded-md border border-border bg-background p-4">
          <label
            htmlFor={consentId}
            title={TCPA_CONSENT_LABEL}
            className="flex cursor-pointer items-start gap-3"
          >
            <input
              id={consentId}
              type="checkbox"
              checked={agreed}
              onChange={(event) => setAgreed(event.currentTarget.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
            />
            <span className="text-xs leading-relaxed text-muted-foreground">
              {TCPA_CONSENT_TEXT}
              <Link
                href="/terms#tcpa-consent"
                className="whitespace-nowrap text-primary underline underline-offset-4 hover:text-primary/80"
              >
                {TCPA_CONSENT_LINK_TEXT}
              </Link>
            </span>
          </label>
          {!agreed && (
            <p className="mt-2 pl-7 text-[0.7rem] leading-relaxed text-muted-foreground/80">
              Accept the consent above to load the secure form.
            </p>
          )}
        </div>
      )}

      {showEmbed && (
        <Suspense
          fallback={
            <div style={{ height: props.height }} aria-hidden="true" />
          }
        >
          <GhlFormEmbedInner {...props} />
        </Suspense>
      )}

      {showLegal && (
        <LegalLinks
          lead="Submitting this form means you agree to our"
          className={legalClassName}
        />
      )}
    </div>
  );
}
