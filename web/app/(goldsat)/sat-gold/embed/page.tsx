import type { Metadata } from "next";
import { SatEmbedPage } from "@/components/satellite/SatEmbedPage";
import { SAT_SITES } from "@/lib/satellites";

export const dynamic = "force-dynamic";
// The widget page itself stays out of search results; the site links to it from the "Add to site" panel.
export const metadata: Metadata = {
  title: { absolute: "Live gold price widget" },
  robots: { index: false, follow: true },
};

export default function Page() {
  return <SatEmbedPage site={SAT_SITES.gold} />;
}
