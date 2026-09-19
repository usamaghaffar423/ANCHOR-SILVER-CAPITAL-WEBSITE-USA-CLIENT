import type { Metadata } from "next";
import { PageHero } from "@/components/site/PageHero";
import { Prose, Section } from "@/components/site/ui";
import { SITE, pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Risk Disclosure — Anchor Silver Capital",
  description:
    "Important risk disclosures regarding precious metals investing, including market volatility, liquidity risk, and tax considerations.",
  path: "/riskdisclosure",
});

export default function RiskDisclosure() {
  return (
    <>
      <PageHero
        eyebrow="Risk Disclosure"
        title="Important Risk Information"
        subtitle="Precious metals investing involves significant risk. Please review the following before making any investment decisions."
      />

      <Section>
        <Prose>
          <p>
            <strong>Effective Date:</strong> August 16, 2026
          </p>

          <h3>Risk Disclosure Statement</h3>
          <p>
            Investing in precious metals involves substantial risk. Before purchasing precious metals,
            you should carefully consider the following risk factors and consult with your own financial,
            tax, and legal advisors.
          </p>

          <h3>Market Risk</h3>
          <p>
            Precious metals prices are volatile and can fluctuate significantly due to market conditions,
            economic factors, geopolitical events, and supply and demand dynamics. The value of any
            precious metals you purchase may go down as well as up. Past performance does not guarantee
            future results. There is no guarantee that precious metals will maintain their value over
            time.
          </p>

          <h3>Liquidity Risk</h3>
          <p>
            While precious metals are generally considered liquid assets, there may be times when it
            is difficult or impossible to sell metals at a desired price. Market conditions, dealer
            inventory, and other factors can affect buyback pricing and availability.
          </p>

          <h3>No Guarantee of Profit</h3>
          <p>
            We make no representation or warranty that any precious metals purchase will appreciate
            in value, protect against inflation, or perform in any particular way. Historical price
            references, market commentary, and supply-and-demand statistics are for context only
            and do not predict future outcomes.
          </p>

          <h3>Storage and Insurance Risks</h3>
          <p>
            Physical precious metals require secure storage. While we work with Delaware Depository
            and other approved storage facilities, there are inherent risks associated with the
            storage of physical assets, including potential loss, theft, or damage. Insurance coverage
            may have limitations and exclusions.
          </p>

          <h3>IRA and Tax Considerations</h3>
          <p>
            Precious metals IRA rollovers and transactions involve complex tax, legal, and regulatory
            considerations. The tax advantages of a Precious Metals IRA may vary based on your individual
            circumstances. We coordinate with third-party custodians and depositories, but we do not
            provide tax or legal advice. Consult a qualified tax professional or attorney before
            initiating any rollover or retirement account transaction.
          </p>

          <h3>Counterparty Risk</h3>
          <p>
            While physical precious metals have no counterparty risk in the same way that paper assets
            do, transactions involving precious metals do involve counterparty risk. This includes the
            risk that a dealer, custodian, or depository may default on its obligations.
          </p>

          <h3>Inflation Hedge Disclaimer</h3>
          <p>
            Precious metals are sometimes described as a hedge against inflation. While precious metals
            have historically maintained value during periods of inflation, this is not guaranteed and
            past performance is not indicative of future results.
          </p>

          <h3>Consult a Professional</h3>
          <p>
            Before making any financial decision, consult a licensed financial advisor, tax
            professional, or attorney. Do not rely solely on the information on this website when
            making investment decisions. {SITE.legal} is a precious metals dealer, not a registered
            investment advisor, broker-dealer, or financial planner.
          </p>

          <h3>Contact Us</h3>
          <p>
            If you have questions about this risk disclosure, please contact us at{" "}
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
