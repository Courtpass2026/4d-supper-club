// Builds rig-test.html: src/rig-test.src.html with the Rive runtime JS, its
// .wasm and fighter-rig-test.riv inlined, so the page makes no network requests.
//
//   node tools/build-html.mjs
//
// The runtime comes from the npm package @rive-app/canvas-advanced (pinned
// below). It is fetched once with `npm pack` into .cache/ (git-ignored).

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const RIVE_PKG = "@rive-app/canvas-advanced";
const RIVE_VERSION = "2.43.1";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const cacheDir = join(root, ".cache", `canvas-advanced-${RIVE_VERSION}`);
const pkgDir = join(cacheDir, "package");

if (!existsSync(join(pkgDir, "canvas_advanced.mjs"))) {
  mkdirSync(cacheDir, { recursive: true });
  const tgz = execFileSync(
    "npm",
    ["pack", `${RIVE_PKG}@${RIVE_VERSION}`, "--silent", "--pack-destination", cacheDir],
    { encoding: "utf8" },
  ).trim();
  execFileSync("tar", ["xzf", join(cacheDir, tgz), "-C", cacheDir]);
}

// The package ships an ES module ending in `export default Rive;`. Turn it
// into a classic script that exposes the factory as a global.
let runtimeJs = readFileSync(join(pkgDir, "canvas_advanced.mjs"), "utf8");
const exportRe = /export\s+default\s+Rive\s*;?\s*$/;
if (!exportRe.test(runtimeJs)) throw new Error("unexpected runtime module format");
runtimeJs = runtimeJs.replace(exportRe, "window.RiveCanvasAdvanced = Rive;\n");
if (/<\/script/i.test(runtimeJs)) throw new Error("runtime JS contains </script");
runtimeJs = `// ${RIVE_PKG} ${RIVE_VERSION} (MIT License, Copyright (c) Rive) - https://github.com/rive-app/rive-wasm\n${runtimeJs}`;

const wasm = readFileSync(join(pkgDir, "rive.wasm"));
const riv = readFileSync(join(root, "fighter-rig-test.riv"));

const fill = (html, token, value) => {
  if (!html.includes(token)) throw new Error(`template is missing ${token}`);
  return html.replace(token, () => value); // function form: no `$` expansion
};

let html = readFileSync(join(root, "src", "rig-test.src.html"), "utf8");
html = fill(html, "__RIVE_VERSION__", RIVE_VERSION);
html = fill(html, "__RIVE_WASM_BASE64__", wasm.toString("base64"));
html = fill(html, "__RIG_RIV_BASE64__", riv.toString("base64"));
html = fill(html, "/*__RIVE_RUNTIME_JS__*/", runtimeJs);

const out = join(root, "rig-test.html");
writeFileSync(out, html);
console.log(
  `wrote ${out} (${(html.length / 1e6).toFixed(2)} MB: wasm ${wasm.length} B, riv ${riv.length} B, runtime JS ${runtimeJs.length} B)`,
);

// --artifact <file>: the same page without the document wrapper tags, for
// hosts that supply their own <!doctype>/<head>/<body> (claude.ai Artifacts).
const artifactIdx = process.argv.indexOf("--artifact");
if (artifactIdx > 0) {
  const artifactOut = process.argv[artifactIdx + 1];
  const head = html.slice(0, html.indexOf("<!--")); // wrapper tags live before the first comment
  const stripped = head
    .replace(/^<!doctype html>\n/i, "")
    .replace(/^<html[^>]*>\n/m, "")
    .replace(/^<head>\n/m, "")
    .replace(/^<meta charset[^>]*>\n/m, "")
    .replace(/^<meta name="viewport"[^>]*>\n/m, "")
    .replace(/^<\/head>\n/m, "")
    .replace(/^<body>\n/m, "");
  const tail = html.slice(html.indexOf("<!--")).replace(/<\/body>\n<\/html>\n?$/, "");
  if (/<\/?(html|head|body)\b/i.test(stripped) || !html.trimEnd().endsWith("</html>")) {
    throw new Error("could not strip the document wrapper");
  }
  writeFileSync(artifactOut, stripped + tail);
  console.log(`wrote ${artifactOut} (artifact variant)`);
}
