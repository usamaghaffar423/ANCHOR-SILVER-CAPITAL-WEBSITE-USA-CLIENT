const SOURCES = {
  Silver: { host: "silvercurrentprice.com", url: "https://silvercurrentprice.com" },
  Gold: { host: "goldcurrentprice.com", url: "https://goldcurrentprice.com" },
} as const;

/** Small muted attribution caption shown directly under a price/chart widget. */
export function SourceLine({ metal }: { metal: keyof typeof SOURCES }) {
  const s = SOURCES[metal];
  return (
    <p className="mt-3 text-xs text-muted-foreground">
      Source:{" "}
      <a href={s.url} target="_blank" rel="noopener" className="underline underline-offset-2 hover:text-foreground">
        {s.host}
      </a>
    </p>
  );
}
