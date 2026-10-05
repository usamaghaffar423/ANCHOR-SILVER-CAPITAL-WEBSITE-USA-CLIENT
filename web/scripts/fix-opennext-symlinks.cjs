const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const NM = path.join(ROOT, "node_modules");
const TARGETS = [path.join(ROOT, ".next", "standalone"), path.join(ROOT, ".open-next")];

const stats = { checked: 0, broken: 0, relinked: 0, sourced: 0, failed: [] };

function ensureTarget(resolved) {
  if (fs.existsSync(resolved)) return true;
  const relParts = path.relative(ROOT, resolved).split(path.sep);
  const nmIdx = relParts.indexOf("node_modules");
  if (nmIdx === -1) return false;
  const tail = relParts.slice(nmIdx + 1);
  const candidates = [path.join(NM, ...tail)];
  if (tail[0] && tail[0] !== ".pnpm") {
    candidates.push(path.join(NM, ".pnpm", ...tail));
  }
  const src = candidates.find((c) => fs.existsSync(c));
  if (!src) return false;
  fs.mkdirSync(path.dirname(resolved), { recursive: true });
  fs.cpSync(src, resolved, { recursive: true });
  stats.sourced++;
  return true;
}

function relink(linkPath, target, targetIsDir) {
  try {
    fs.unlinkSync(linkPath);
  } catch (e) {
    return e.code;
  }
  try {
    fs.symlinkSync(target, linkPath, targetIsDir ? "dir" : "file");
  } catch (e) {
    try {
      fs.symlinkSync(target, linkPath, targetIsDir ? "file" : "dir");
    } catch (e2) {
      return e2.code;
    }
  }
  return null;
}

function walk(dir) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch (e) {
    stats.failed.push(`readdir ${dir}: ${e.code}`);
    return;
  }
  for (const entry of entries) {
    const p = path.join(dir, entry.name);
    if (entry.isSymbolicLink()) {
      stats.checked++;
      let ok = true;
      try {
        fs.realpathSync(p);
      } catch {
        ok = false;
      }
      if (ok) continue;
      stats.broken++;
      const target = fs.readlinkSync(p);
      const resolved = path.resolve(path.dirname(p), target);
      if (!ensureTarget(resolved)) {
        stats.failed.push(`missing target: ${p} -> ${target}`);
        continue;
      }
      const isDir = fs.statSync(resolved).isDirectory();
      const err = relink(p, target, isDir);
      if (err) stats.failed.push(`relink ${p}: ${err}`);
      else stats.relinked++;
    } else if (entry.isDirectory()) {
      walk(p);
    }
  }
}

function runOnce(roots) {
  stats.checked = 0;
  stats.broken = 0;
  stats.relinked = 0;
  stats.sourced = 0;
  stats.failed = [];
  roots.filter((t) => fs.existsSync(t)).forEach(walk);
  return roots.filter((t) => fs.existsSync(t)).length;
}

if (process.argv.includes("--watch")) {
  const roots = [path.join(ROOT, ".open-next")];
  console.log("fix-opennext-symlinks: watching " + roots.join(", ") + " ...");
  let last = "";
  setInterval(() => {
    try {
      runOnce(roots);
    } catch (e) {
      console.log("watch error: " + (e.code || e.message));
    }
    const summary = `broken=${stats.broken} relinked=${stats.relinked} sourced=${stats.sourced}`;
    if (summary !== last) {
      last = summary;
      console.log(
        `fix-opennext-symlinks: checked=${stats.checked} ${summary} failed=${stats.failed.length}`
      );
      stats.failed.slice(0, 5).forEach((f) => console.log("  FAIL " + f));
    }
  }, 100);
} else {
  const roots = runOnce(TARGETS);
  if (!roots) {
    console.log("fix-opennext-symlinks: no build output found, nothing to do");
    process.exit(0);
  }
  console.log(
    `fix-opennext-symlinks: checked=${stats.checked} broken=${stats.broken} relinked=${stats.relinked} sourced=${stats.sourced} failed=${stats.failed.length}`
  );
  stats.failed.forEach((f) => console.log("  FAIL " + f));
  process.exit(stats.failed.length ? 1 : 0);
}
