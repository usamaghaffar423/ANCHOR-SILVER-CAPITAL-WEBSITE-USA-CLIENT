import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/site/PageHero";
import { Prose, Section } from "@/components/site/ui";
import { SITE, pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Risk Disclosure Statement — Anchor Silver Capital",
  description:
    "Read the full Risk Disclosure Statement for Anchor Silver Capital LLC before purchasing precious metals products.",
  path: "/riskdisclosure",
});

const toc = [
  "Precious Metals Are Speculative Investments",
  "No Guarantee of Profit",
  "Premiums and Pricing",
  "Liquidity Risk",
  "Not FDIC or SIPC Insured",
  "Storage and Custody Risk",
  "IRA-Specific Risks",
  "No Investment, Tax, or Legal Advice",
  "Alternative Providers",
  "Acknowledgment",
];

export default function RiskDisclosure() {
  return (
    <>
      <PageHero
        eyebrow="Legal Disclosure"
        title="Risk Disclosure Statement"
        subtitle={`${SITE.legal} — please read this document in full before purchasing precious metals products.`}
      />

      <Section>
        <Prose className="max-w-4xl">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            Last Updated: September 19, 2026
          </p>

          <p>
            This Risk Disclosure Statement is incorporated by reference into the Customer Agreement
            between Client and {SITE.legal} (&ldquo;ASC&rdquo;). Please read this document full
            before purchasing precious metals products. If you do not understand any part of this
            disclosure, consult your attorney, tax advisor, or financial advisor before proceeding.
          </p>

          {/* Table of Contents */}
          <div className="my-8 rounded-md border border-border bg-muted p-6">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Table of Contents
            </p>
            <ol className="list-decimal space-y-1 pl-5 text-sm">
              {toc.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </div>

          <h3>1. Precious Metals Are Speculative Investments</h3>
          <p>
            The price of gold, silver, and other precious metals fluctuates based on global market
            conditions, industrial demand, currency movements, interest rates, and geopolitical
            events. Past performance of any metal does not guarantee future results. The value of
            your metals may decrease as well as increase, and there is no guarantee you will be able
            to sell your metals for the price you paid.
          </p>

          <h3>2. No Guarantee of Profit</h3>
          <p>
            {SITE.legal} makes no representation, warranty, or guarantee regarding the future value,
            price appreciation, or profitability of any product purchased. Anyone who suggests a
            guaranteed return on precious metals is not speaking on behalf of Silver Capital&rsquo;s
            behalf, and you should notify our Client Relations Department in writing immediately.
          </p>

          <h3>3. Premiums and Pricing</h3>
          <p>
            All products are sold at a premium over the spot price of the underlying metal. This
            premium covers sourcing, fabrication, delivery, and operational costs. Premiums vary by
            product type:
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong>Common Bullion Products</strong> (e.g., government-minted coins, standard bars):
              typically 2% to 15% over spot
            </li>
            <li>
              <strong>Premium Products</strong> (e.g., semi-numismatic and numismatic items): typically
              5% to 15% over spot
            </li>
          </ul>
          <p>
            Because you buy at the &ldquo;ask&rdquo; price and sell back at the lower &ldquo;bid&rdquo;
            price, your investment must appreciate beyond this spread before you realize a profit.
            Premiums and spreads are subject to change and may vary between transactions.
          </p>

          <h3>4. Liquidity Risk</h3>
          <p>
            Precious metals are not as liquid as publicly traded securities. Selling your metals may
            take time, and the price you receive will depend on market conditions and the liquidity of
            the specific product at the time of sale. {SITE.legal}&rsquo;s buy-back policy is not a
            guarantee to repurchase any product, and buy-back terms are subject to change without
            notice.
          </p>

          <h3>5. Not FDIC or SIPC Insured</h3>
          <p>
            Precious metals are physical commodities, not bank deposits or securities. They are not
            insured by the FDIC, SIPC, or any other government or private insurance program. If you
            choose third-party depository storage, ask the storage provider directly about their
            insurance coverage.
          </p>

          <h3>6. Storage and Custody Risk</h3>
          <p>
            If you store metals with a third-party depository, {SITE.legal} is not responsible for
            the security, condition, or insurance of metals once they are in that depository&rsquo;s
            custody. You are solely responsible for selecting a storage provider and understanding
            their terms.
          </p>

          <h3>7. IRA-Specific Risks</h3>
          <p>
            If you are purchasing precious metals for a self-directed IRA, additional risks and rules
            apply, including IRS eligibility requirements for metals held in retirement accounts,
            custodian fees, storage fees, and required minimum distribution (RMD) rules once you
            reach RMD age. Metals held in an IRA cannot be held in personal possession. Consult a
            qualified tax advisor regarding the tax treatment of precious metals IRAs.
          </p>

          <h3>8. No Investment, Tax, or Legal Advice</h3>
          <p>
            {SITE.legal} does not provide investment, tax, or legal advice. Nothing on this website
            or in any communication from {SITE.legal} should be construed as a recommendation to
            buy, sell, or hold any product. You are solely responsible for your own investment
            decisions and are encouraged to consult independent professionals before purchasing.
          </p>

          <h3>9. Alternative Providers</h3>
          <p>
            The products sold by {SITE.legal} can be purchased from other dealers. You are under no
            obligation to purchase exclusively from {SITE.legal} and are encouraged to compare
            pricing and terms with other providers.
          </p>

          <h3>10. Acknowledgment</h3>
          <p>
            By signing the Customer Agreement, you acknowledge that you have read, understood, and
            accept the risks described in this Risk Disclosure Statement.
          </p>

          <div className="mt-10 border-t border-border pt-6 text-sm text-muted-foreground">
            <Link href="/" className="text-primary underline underline-offset-4">
              &larr; Back to Homepage
            </Link>
            <span className="mx-3">·</span>
            <Link href="/terms" className="text-primary underline underline-offset-4">
              Customer Agreement (Terms of Use)
            </Link>
          </div>
        </Prose>
      </Section>
    </>
  );
}
