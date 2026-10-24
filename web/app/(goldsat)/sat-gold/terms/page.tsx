import { SatLegal } from "@/components/satellite/SatLegal";
import { satLegalMeta } from "@/lib/satellite-meta";
import { SAT_SITES } from "@/lib/satellites";

export const dynamic = "force-dynamic";
export const metadata = satLegalMeta(SAT_SITES.gold, "terms");

export default function Page() {
  return <SatLegal site={SAT_SITES.gold} kind="terms" />;
}
