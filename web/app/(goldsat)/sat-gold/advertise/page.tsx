import { SatAdvertisePage } from "@/components/satellite/SatAdvertisePage";
import { satLegalMeta } from "@/lib/satellite-meta";
import { SAT_SITES } from "@/lib/satellites";

export const dynamic = "force-dynamic";
export const metadata = satLegalMeta(SAT_SITES.gold, "advertise");

export default function Page() {
  return <SatAdvertisePage site={SAT_SITES.gold} />;
}
