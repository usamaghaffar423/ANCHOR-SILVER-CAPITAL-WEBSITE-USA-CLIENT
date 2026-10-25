import { permanentRedirect } from "next/navigation";

export const dynamic = "force-dynamic";

/** The general contact form is gone; the only form is the advertising inquiry. */
export default function Page() {
  permanentRedirect("/advertise");
}
