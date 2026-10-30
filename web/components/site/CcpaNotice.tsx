import {
  NOTICE_AT_COLLECTION,
  NOTICE_AT_COLLECTION_HREF,
  NOTICE_AT_COLLECTION_LINK_TEXT,
} from "@/content/privacy-ccpa";

/**
 * Notice at collection, shown under the consent text of every lead form (the consent
 * text itself is not touched). Text lives in content/privacy-ccpa.ts. The styling class
 * comes from the host form so it matches that form's own small print.
 */
export function CcpaNotice({ className = "" }: { className?: string }) {
  return (
    <p className={className}>
      {NOTICE_AT_COLLECTION}{" "}
      <a href={NOTICE_AT_COLLECTION_HREF} className="underline underline-offset-2">
        {NOTICE_AT_COLLECTION_LINK_TEXT}
      </a>
    </p>
  );
}
