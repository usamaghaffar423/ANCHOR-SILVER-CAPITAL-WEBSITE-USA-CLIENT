export type QA = { q: string; a: string };

/**
 * Native details/summary: the answer text is in the server-rendered HTML
 * (crawlable) and toggling needs no JavaScript.
 */
export function Accordion({ items }: { items: QA[] }) {
  return (
    <div className="divide-y divide-border border-y border-border">
      {items.map((item) => (
        <details key={item.q} className="group py-4">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold text-foreground marker:hidden">
            <span>{item.q}</span>
            <span
              aria-hidden="true"
              className="font-mono text-primary transition-transform duration-200 group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
