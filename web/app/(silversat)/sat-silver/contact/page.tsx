import { SatContactPage } from "@/components/satellite/SatContactPage";
import { satLegalMeta } from "@/lib/satellite-meta";
import { SAT_SITES } from "@/lib/satellites";

export const dynamic = "force-dynamic";
export const metadata = satLegalMeta(SAT_SITES.silver, "contact");

export default function Page() {
  return <SatContactPage site={SAT_SITES.silver} />;
}
