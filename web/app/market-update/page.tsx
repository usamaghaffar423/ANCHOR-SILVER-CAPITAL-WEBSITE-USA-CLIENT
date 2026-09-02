import type { Metadata } from "next";
import { JsonLd } from "@/components/site/JsonLd";
import { MarketUpdateContent } from "@/components/site/MarketUpdateContent";
import { breadcrumbSchema, pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Silver & Gold Market Update — Prices and Ratio | Anchor",
  description:
    "Live gold and silver spot prices, the gold to silver ratio, 12-month performance, and weekly commentary on industrial demand, the supply deficit, and Fed policy.",
  path: "/market-update",
  type: "article",
});

export default function MarketUpdate() {
  return (
    <>
      <JsonLd data={breadcrumbSchema("/market-update", "Market Update")} />
      <MarketUpdateContent />
    </>
  );
}
