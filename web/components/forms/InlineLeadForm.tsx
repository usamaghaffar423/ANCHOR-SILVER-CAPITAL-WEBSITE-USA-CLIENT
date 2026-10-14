import { LeadForm } from "@/components/forms/LeadForm";

/**
 * End-of-page lead form slot (the closing section above the footer on the
 * marketing pages). Native form posting straight to the GHL inbound webhook —
 * the GHL iframe embed that used to live here is gone.
 */
export function InlineLeadForm({
  heading,
  subheading,
  submitLabel,
}: {
  heading?: string;
  subheading?: string;
  submitLabel?: string;
}) {
  return (
    <div className="mx-auto w-full max-w-lg rounded-md border border-border bg-card p-6 text-left shadow-[var(--shadow-card)]">
      {heading && <h3 className="text-xl text-foreground">{heading}</h3>}
      {subheading && <p className="mt-1.5 text-sm text-muted-foreground">{subheading}</p>}
      <LeadForm submitLabel={submitLabel} className={heading || subheading ? "mt-5" : undefined} />
    </div>
  );
}
