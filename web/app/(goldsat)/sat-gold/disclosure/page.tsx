import { SatDisclosure } from "@/components/satellite/SatDisclosure";
import { satLegalMeta } from "@/lib/satellite-meta";
import { SAT_SITES } from "@/lib/satellites";

export const dynamic = "force-dynamic";
export const metadata = satLegalMeta(SAT_SITES.gold, "disclosure");

export default function Page() {
  return <SatDisclosure site={SAT_SITES.gold} />;
}
