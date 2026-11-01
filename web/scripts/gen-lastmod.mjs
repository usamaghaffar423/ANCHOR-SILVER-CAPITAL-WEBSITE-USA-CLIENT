/**
 * Writes lib/generated/lastmod.json: the real "last modified" date of every sitemap URL, for
 * the three sites. A page's date is the date of the latest git commit touching the source files
 * that make up that page (its route file plus the shared content/components it renders), so
 * <lastmod> only moves when the page actually changes, never "now" on each request.
 *
 * Runs in `pnpm build`. If git is unavailable (a build without history) the existing file is left
 * untouched, so the last known dates keep being served.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(root, "lib/generated/lastmod.json");

const site = (route) => (route === "/" ? ["app/(site)/page.tsx"] : [`app/(site)${route}/page.tsx`]);
const price = ["components/site/PricePage.tsx", "components/site/PriceChart.tsx", "components/site/SourceLine.tsx"];
const home = ["lib/home-content.ts", "app/(site)/home.css", "components/home/HomeClient.tsx", "components/home/HomeImage.tsx"];
const legalShared = ["components/site/PageHero.tsx"];

/** Anchor routes -> source files. Keep in step with app/sitemap.ts. */
const anchor = {
  "/": [...site("/"), ...home],
  "/why-silver": site("/why-silver"),
  "/silver-ira": site("/silver-ira"),
  "/physical-silver": site("/physical-silver"),
  "/silver-supply": site("/silver-supply"),
  "/about": site("/about"),
  "/buyinggoldandsilver": site("/buyinggoldandsilver"),
  "/get-started": [...site("/get-started"), ...home],
  "/faq": site("/faq"),
  "/market-update": [...site("/market-update"), "components/site/MarketUpdateContent.tsx"],
  "/silver-price-per-ounce": [...site("/silver-price-per-ounce"), ...price],
  "/gold-price-per-ounce": [...site("/gold-price-per-ounce"), ...price],
  "/contact": site("/contact"),
  "/privacy": [...site("/privacy"), "content/privacy-ccpa.ts", ...legalShared],
  "/privacy-choices": [...site("/privacy-choices"), "content/privacy-ccpa.ts", "components/site/PrivacyChoicesPanel.tsx", "components/site/PrivacyRequestForm.tsx"],
  "/terms": [...site("/terms"), ...legalShared],
  "/sms-consent": [...site("/sms-consent"), ...legalShared],
  "/disclaimer": [...site("/disclaimer"), ...legalShared],
  "/riskdisclosure": [...site("/riskdisclosure"), ...legalShared],
};

const satShared = ["components/satellite/SatShell.tsx", "components/satellite/SatNav.tsx", "lib/satellite-content.ts"];
const sat = (dir, home) => ({
  "/": [`app/(${dir === "sat-gold" ? "goldsat" : "silversat"})/${dir}/page.tsx`, "components/satellite/SatPage.tsx", "components/satellite/SatTool.tsx", "components/satellite/SatCandleChart.tsx", "components/satellite/SatConvert.tsx", "lib/satellite-meta.ts", ...satShared],
  "/advertise": [`app/(${dir === "sat-gold" ? "goldsat" : "silversat"})/${dir}/advertise/page.tsx`, "components/satellite/SatAdvertisePage.tsx", "components/satellite/SatAdvertise.tsx"],
  "/privacy": [`app/(${dir === "sat-gold" ? "goldsat" : "silversat"})/${dir}/privacy/page.tsx`, "components/satellite/SatLegal.tsx"],
  "/terms": [`app/(${dir === "sat-gold" ? "goldsat" : "silversat"})/${dir}/terms/page.tsx`, "components/satellite/SatLegal.tsx"],
});

const groups = { anchor, gold: sat("sat-gold"), silver: sat("sat-silver") };

function lastCommitDate(files) {
  const existing = files.filter((f) => existsSync(join(root, f)));
  if (!existing.length) return null;
  const out = execFileSync("git", ["log", "-1", "--format=%cs", "--", ...existing], { cwd: root, encoding: "utf8" }).trim();
  return out || null;
}

try {
  execFileSync("git", ["rev-parse", "--is-inside-work-tree"], { cwd: root, stdio: "ignore" });
} catch {
  console.log("[lastmod] git unavailable; keeping existing lib/generated/lastmod.json");
  process.exit(0);
}

const result = {};
for (const [name, routes] of Object.entries(groups)) {
  result[name] = {};
  for (const [route, files] of Object.entries(routes)) {
    const d = lastCommitDate(files);
    if (d) result[name][route] = d;
  }
}

const next = JSON.stringify(result, null, 2) + "\n";
mkdirSync(dirname(OUT), { recursive: true });
if (!existsSync(OUT) || readFileSync(OUT, "utf8") !== next) writeFileSync(OUT, next);
console.log(`[lastmod] ${Object.values(result).reduce((n, g) => n + Object.keys(g).length, 0)} routes dated`);
