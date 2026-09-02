/**
 * Renders a JSON-LD <script> tag. Ported from the source route `head().scripts`
 * entries, which emitted `<script type="application/ld+json">` per page.
 */
export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
