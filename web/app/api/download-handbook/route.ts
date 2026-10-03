import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse, type NextRequest } from "next/server";
import { HANDBOOK_PDF_BASE64 } from "@/lib/generated/handbook-pdf";
import { isHandbookTokenValid } from "@/lib/handbook-token";

export const runtime = "nodejs";

/** Kept in private_docs/ (outside /public) so no static URL can ever serve it. */
const PDF_FILE = "Silver-IRA-Handbook.pdf";

const DOWNLOAD_HEADERS: Record<string, string> = {
  "Content-Type": "application/pdf",
  "Content-Disposition": 'inline; filename="Anchor-Silver-IRA-Handbook.pdf"',
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
};

async function readHandbook(): Promise<Uint8Array<ArrayBuffer> | null> {
  // 1) Filesystem — private_docs/ via Node fs (works in next dev / next start).
  try {
    const buf = await fs.readFile(path.join(process.cwd(), "private_docs", PDF_FILE));
    return new Uint8Array(buf);
  } catch {
    // File missing, or no real filesystem (Cloudflare Workers virtual fs) → fall through.
  }
  // 2) Copy embedded in the Worker bundle at build time (works on Cloudflare).
  if (HANDBOOK_PDF_BASE64) {
    return new Uint8Array(Buffer.from(HANDBOOK_PDF_BASE64, "base64"));
  }
  return null;
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!isHandbookTokenValid(token)) {
    return NextResponse.json(
      { error: "Forbidden: missing, invalid, or expired download link." },
      { status: 403, headers: { "Cache-Control": "no-store" } },
    );
  }

  const file = await readHandbook();
  if (!file) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return new NextResponse(file, { status: 200, headers: DOWNLOAD_HEADERS });
}
