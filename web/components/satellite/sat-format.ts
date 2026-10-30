export type SatCandle = { t: number; o: number; h: number; l: number; c: number };

export const usd = (n: number, d = 2) =>
  `$${n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d })}`;
