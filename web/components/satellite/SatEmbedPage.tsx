import { SatEmbed } from "@/components/satellite/SatEmbed";
import { getDailyCandles, getOhlc24h, getSpotPrices } from "@/lib/metals";
import { assertSatelliteHost, type SatSite } from "@/lib/satellites";

/** /embed: the framable price widget. Server-rendered with real data, then live-refreshed. */
export async function SatEmbedPage({ site }: { site: SatSite }) {
  await assertSatelliteHost(site);
  const [spotPair, ohlc, candles] = await Promise.all([
    getSpotPrices(),
    getOhlc24h(site.symbol),
    getDailyCandles(site.symbol),
  ]);
  const spot = spotPair ? (site.symbol === "XAU" ? spotPair.gold : spotPair.silver) : null;
  return (
    <SatEmbed
      symbol={site.symbol}
      metal={site.metal}
      host={site.host}
      initialSpot={spot}
      openPrice={ohlc?.open ?? null}
      closes={(candles ?? []).slice(-30).map((c) => c.c)}
    />
  );
}
