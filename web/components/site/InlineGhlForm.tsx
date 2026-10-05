import { GhlFormEmbed } from "@/components/site/GhlFormEmbed";

const FORM_ID = "3SC4Eeds4Q91kqrFEijR";
const FORM_NAME = "Critical Minerals Report Form";

/**
 * End-of-page lead form slot (the closing section above the footer on the
 * marketing pages). The form itself is hosted in GHL and rendered inside an
 * iframe — no `/api/lead` round-trip, no TCPA/consent markup of our own.
 * On submit GHL redirects to `/thank-you-critical-minerals`, which delivers
 * the Silver IRA Handbook (the site's only lead magnet).
 */
export function InlineGhlForm({ heading, subheading }: { heading?: string; subheading?: string }) {
  return (
    <div className="mx-auto w-full max-w-lg rounded-md border border-border bg-card p-6 text-left shadow-[var(--shadow-card)]">
      {heading && <h3 className="text-xl text-foreground">{heading}</h3>}
      {subheading && <p className="mt-1.5 text-sm text-muted-foreground">{subheading}</p>}
      <div className={heading || subheading ? "mt-5" : undefined}>
        <GhlFormEmbed
          formId={FORM_ID}
          formName={FORM_NAME}
          height={824}
          title={FORM_NAME}
        />
      </div>
    </div>
  );
}
