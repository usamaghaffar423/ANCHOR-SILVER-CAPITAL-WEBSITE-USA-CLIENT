import { SatPage } from "@/components/satellite/SatPage";
import { satHomeMeta } from "@/lib/satellite-meta";
import { SAT_SITES } from "@/lib/satellites";

export const dynamic = "force-dynamic";
export const metadata = satHomeMeta(SAT_SITES.gold);

export default function Page() {
  return <SatPage site={SAT_SITES.gold} />;
}
