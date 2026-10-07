import Link from "next/link";

const linkCls = "text-primary underline underline-offset-4 hover:text-primary/80";

/**
 * Privacy Policy + Terms of Use links shown with every lead form (GuidePopup
 * and the GHL iframe embeds). Kept in one place so the wording and targets can
 * never drift between forms.
 */
export function LegalLinks({
  lead = "By submitting, you agree to our",
  className = "",
}: {
  lead?: string;
  className?: string;
}) {
  return (
    <p className={`text-xs leading-relaxed text-muted-foreground ${className}`}>
      {lead}{" "}
      <Link href="/privacy" className={linkCls}>
        Privacy Policy
      </Link>{" "}
      and{" "}
      <Link href="/terms" className={linkCls}>
        Terms of Use
      </Link>
      .
    </p>
  );
}
