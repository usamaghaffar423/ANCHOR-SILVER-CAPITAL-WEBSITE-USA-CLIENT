import type { Metadata } from "next";
import { PageHero } from "@/components/site/PageHero";
import { Prose, Section } from "@/components/site/ui";
import { SITE, pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Disclaimer — Anchor Silver Capital",
  description:
    "Important disclaimers regarding precious metals, investment risk, and the information provided on this website.",
  path: "/disclaimer",
});

export default function Disclaimer() {
  return (
    <>
      <PageHero
        eyebrow="Disclaimer"
        title="Please Read This Carefully"
        subtitle="This website is for informational purposes only. Nothing here is a recommendation to buy or sell any asset."
      />

      <Section>
        <Prose>
          <p>
            <strong>Effective Date:</strong> August 16, 2026
          </p>
          <p>
            The information contained on this website is provided by {SITE.legal} for general
            informational purposes only. It is not intended to be, and should not be construed as,
            investment, legal, tax, or financial advice.
          </p>

          <h3>Not Investment Advice</h3>
          <p>
            {SITE.legal} is a precious metals dealer, not a registered investment advisor,
            broker-dealer, or financial planner. The content on this website is not a recommendation
            to buy, sell, or hold precious metals or any other investment. Any decision to purchase
            precious metals should be based on your own research and consultation with qualified
            professionals.
          </p>

          <h3>Market and Price Risk</h3>
          <p>
            Precious metals prices are volatile and can fluctuate significantly due to market
            conditions, economic factors, geopolitical events, and supply and demand dynamics. The
            value of any precious metals you purchase may go down as well as up. Past performance
            does not guarantee future results.
          </p>

          <h3>No Guarantees</h3>
          <p>
            We make no representation or warranty that any precious metals purchase will appreciate
            in value, protect against inflation, or perform in any particular way. Historical price
            references, market commentary, and supply-and-demand statistics are for context only
            and do not predict future outcomes.
          </p>

          <h3>IRA and Tax Considerations</h3>
          <p>
            Precious Metals IRA rollovers and transactions involve tax, legal, and regulatory
            considerations. We coordinate with third-party custodians and depositories, but we do not
            provide tax or legal advice. Consult a qualified tax professional or attorney before
            initiating any rollover or retirement account transaction.
          </p>

          <h3>Third-Party Information</h3>
          <p>
            We may reference market data, industry reports, or news sources on this website. While we
            strive to use reliable sources, we do not guarantee the accuracy, completeness, or
            timeliness of any third-party information.
          </p>

          <h3>Consult a Professional</h3>
          <p>
            Before making any financial decision, consult a licensed financial advisor, tax
            professional, or attorney. Do not rely solely on the information on this website when
            making investment decisions.
          </p>

          <h3>Contact Us</h3>
          <p>
            If you have questions about this disclaimer, please contact us at{" "}
            <a href={`mailto:${SITE.email}`} className="text-primary underline underline-offset-4">
              {SITE.email}
            </a>{" "}
            or by phone at{" "}
            <a href={SITE.phoneHref} className="text-primary underline underline-offset-4">
              {SITE.phone}
            </a>
            .
          </p>
        </Prose>
      </Section>
    </>
  );
}
