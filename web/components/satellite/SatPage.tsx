import { JsonLd } from "@/components/site/JsonLd";
import { SatHeroCta, SatSponsorModule, SatTrust } from "@/components/satellite/SatConvert";
import { SatShell } from "@/components/satellite/SatShell";
import { SatSignup } from "@/components/satellite/SatSignup";
import { SatTool } from "@/components/satellite/SatTool";
import { SAT_CONTENT } from "@/lib/satellite-content";
import { getDailyCandles, getOhlc24h, getSpotPrices } from "@/lib/metals";
import { PUBLISHER, PUBLISHER_URL, assertSatelliteHost, type SatSite } from "@/lib/satellites";

/**
 * Home page of a standalone price site. Server-rendered per request (spot, 24h
 * OHLC and candles are in the first HTML); paid-API calls are cached by
 * lib/edge-cache.ts. Returns 404 on any host other than the site's own.
 */
export async function SatPage({ site }: { site: SatSite }) {
  await assertSatelliteHost(site);
  const c = SAT_CONTENT[site.key];
  const [spotPair, ohlc, candles] = await Promise.all([
    getSpotPrices(),
    getOhlc24h(site.symbol),
    getDailyCandles(site.symbol),
  ]);
  const spot = spotPair ? (site.symbol === "XAU" ? spotPair.gold : spotPair.silver) : null;

  const publisher = { "@type": "Organization", name: PUBLISHER, url: PUBLISHER_URL };
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${site.origin}/#website`,
        url: `${site.origin}/`,
        name: site.wordmark,
        publisher,
      },
      {
        "@type": "WebPage",
        "@id": `${site.origin}/#webpage`,
        url: `${site.origin}/`,
        name: c.title,
        description: c.description,
        keywords: c.keywords.join(", "),
        isPartOf: { "@id": `${site.origin}/#website` },
        about: { "@type": "Thing", name: `${site.metal} spot price per troy ounce` },
        dateModified: new Date().toISOString(),
        inLanguage: "en-US",
      },
      {
        "@type": "FAQPage",
        mainEntity: c.faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <SatShell site={site}>
      <JsonLd data={graph} />
      <section className="sat-hero">
        <p className="sat-live">
          <i aria-hidden="true" /> Updated every minute
        </p>
        <h1>{c.h1}</h1>
        <p>{c.lede}</p>
      </section>

      <SatTool
        symbol={site.symbol}
        metal={site.metal}
        initialSpot={spot}
        initialUpdatedAt={spotPair?.updatedAt ?? null}
        ohlc={ohlc}
        candles={candles}
        units={c.units}
        purities={c.purities}
        chartNote={c.chartNote}
        afterSpot={
          <>
            <SatHeroCta site={site} />
            <SatTrust site={site} />
          </>
        }
      />

      <SatSponsorModule site={site} placement="module" />

      <div className="sat-content">
        {c.sections.map((s) => (
          <div key={s.id} className="sat-block">
            <section id={s.id}>
              <h2>{s.h2}</h2>
              {s.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </section>
            {s.id === "premiums" && (
              <SatSignup
                heading={c.alert.heading}
                text={c.alert.text}
                tag={site.alertTag}
                source={site.source}
              />
            )}
          </div>
        ))}
      </div>

      <section className="sat-faq" id="faq">
        <h2>Questions</h2>
        {c.faq.map((f) => (
          <details key={f.q}>
            <summary>{f.q}</summary>
            <p>{f.a}</p>
          </details>
        ))}
      </section>
      <SatSponsorModule site={site} placement="footer-module" />
    </SatShell>
  );
}
