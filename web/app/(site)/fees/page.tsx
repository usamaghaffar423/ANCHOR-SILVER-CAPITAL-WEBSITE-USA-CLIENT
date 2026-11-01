import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/site/JsonLd";
import { PageHero } from "@/components/site/PageHero";
import { ButtonLink, H2, Section } from "@/components/site/ui";
import { FEES, feesReady } from "@/content/aeo";
import { breadcrumbSchema, pageMeta } from "@/lib/site";

/**
 * /fees: one plain table (fee, who charges it, amount), a worked round-trip example, and a visible
 * "Last updated" date. Returns 404, with no nav, footer or sitemap entry, until every amount in
 * content/aeo.ts is filled and FEES.enabled is true. Amounts come only from that file.
 */
export function generateMetadata(): Metadata {
  if (!feesReady()) return { robots: { index: false, follow: false } };
  return pageMeta({
    title: "Silver IRA Fees: Every Cost in One Place",
    description:
      "Every fee for a silver IRA in one table: who charges it and how much, plus a worked example of buying and selling back.",
    path: "/fees",
  });
}

export default function FeesPage() {
  if (!feesReady()) notFound();
  return (
    <>
      <JsonLd data={breadcrumbSchema("/fees", "Fees")} />
      <PageHero
        eyebrow="Fees"
        title="Every Cost, in One Place"
        subtitle="Who charges each fee and how much. Every quote is in writing before you decide."
      />

      <Section>
        <div className="mx-auto max-w-4xl">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <caption className="sr-only">Fees and costs for a silver IRA</caption>
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                  <th scope="col" className="py-3 pr-4 font-semibold">Fee or cost</th>
                  <th scope="col" className="py-3 pr-4 font-semibold">Charged by</th>
                  <th scope="col" className="py-3 font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody>
                {FEES.rows.map((r) => (
                  <tr key={r.fee} className="border-b border-border align-top">
                    <th scope="row" className="py-3 pr-4 font-medium text-foreground">{r.fee}</th>
                    <td className="py-3 pr-4 text-muted-foreground">{r.chargedBy}</td>
                    <td className="py-3 text-foreground">{r.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-12">
            <H2>{FEES.example.heading}</H2>
            <dl className="mt-5 divide-y divide-border border-y border-border text-sm">
              {FEES.example.lines.map((l) => (
                <div key={l.label} className="flex justify-between gap-6 py-3">
                  <dt className="text-muted-foreground">{l.label}</dt>
                  <dd className="font-medium text-foreground">{l.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <p className="mt-8 text-sm text-muted-foreground">Last updated: {FEES.lastUpdated}</p>
          <div className="mt-6">
            <ButtonLink to="/get-started" variant="primary">
              Get your fees in writing
            </ButtonLink>
          </div>
        </div>
      </Section>
    </>
  );
}
