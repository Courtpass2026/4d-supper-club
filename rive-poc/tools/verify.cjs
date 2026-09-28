// Headless check of rig-test.html with the network switched off.
//
//   NODE_PATH="$(npm root -g)" node tools/verify.cjs        (needs `npm i -g playwright`)
//
// Checks: no network requests, all bones found, Rive's bone transforms match
// the page's own forward kinematics (rotation convention), draw order,
// facing flip, 2D background under / 2D overlay over the Rive fighters.
// Then measures FPS and JS frame time at a few rig counts.

const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs");

const root = path.join(__dirname, "..");
const pageUrl = "file://" + path.join(root, "rig-test.html");
const outDir = path.join(root, "test-output");
fs.mkdirSync(outDir, { recursive: true });

const COLORS = {
  front: [242, 208, 169],
  back: [138, 90, 60],
  torso: [47, 111, 222],
};
const near = (a, b, tol = 12) => a.every((v, i) => Math.abs(v - b[i]) <= tol);
const results = [];
function check(name, ok, detail) {
  results.push({ name, ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? "  -- " + detail : ""}`);
}

async function openPage(browser, query = "", device = { viewport: { width: 1280, height: 720 } }) {
  const context = await browser.newContext({ ...device, offline: true });
  const page = await context.newPage();
  const requests = [];
  const errors = [];
  page.on("request", (r) => requests.push(r.url()));
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await page.goto(pageUrl + query);
  await page.waitForFunction(() => window.__rigTest && (window.__rigTest.error || window.__rigTest.stats.frames > 60), null, { timeout: 30000 });
  return { page, context, requests, errors };
}

(async () => {
  const browser = await chromium.launch();

  // ---- correctness -------------------------------------------------------
  const { page, context, requests, errors } = await openPage(browser);
  const boot = await page.evaluate(() => window.__rigTest.error || null);
  check("page boots with network offline", !boot, boot || "");
  const external = requests.filter((u) => u.split("?")[0] !== pageUrl);
  check("no requests besides the page itself", external.length === 0, external.join(", ") || `${requests.length} request(s) total`);

  await page.waitForTimeout(1500);
  const fk = await page.evaluate(() => window.__rigTest.stats.fkErr);
  check("Rive foot position == page FK (degrees->radians, clockwise, parent-relative)", fk < 0.05, `max error ${fk.toFixed(4)} px`);

  // Draw order + flip on a fresh instance in rest pose, drawn to its own canvas.
  const probe = await page.evaluate(() => {
    const { rive, file, JOINTS } = window.__rigTest;
    const c = document.createElement("canvas");
    c.width = c.height = 600;
    const ctx = c.getContext("2d");
    const r = rive.makeRenderer(c);
    const ab = file.artboardByName("Fighter");
    const found = JOINTS.filter((j) => ab.bone(j));
    // Point the back thigh straight up so it lies inside the torso's outline
    // (at rest the front thigh covers it and the probe would be ambiguous).
    ab.bone("bThigh").rotation = -Math.PI / 2;
    ab.advance(0);
    const pointOn = (bone, along, across = 0) => {
      const w = ab.bone(bone).worldTransform();
      const p = [w.tx + w.xx * along + w.yx * across, w.ty + w.xy * along + w.yy * across];
      w.delete();
      return p;
    };
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, 600, 600);
    r.beginFrame(false);
    r.save();
    ab.draw(r);
    r.restore();
    rive.resolveAnimationFrame();
    const px = ([x, y]) => Array.from(ctx.getImageData(Math.round(x), Math.round(y), 1, 1).data.slice(0, 3));
    const samples = {
      fUpperArm: px(pointOn("fUpperArm", 18)), // front arm over torso
      bUpperArm: px(pointOn("bUpperArm", 18)), // back arm under torso
      fThighHip: px(pointOn("fThigh", 3)), // front leg over torso
      bThighUp: px(pointOn("bThigh", 20)), // back leg under torso
      head: px(pointOn("head", 15)),
    };
    const shoulderRight = pointOn("fUpperArm", 0)[0];
    ab.rootBone("pelvis").scaleX = -1;
    ab.advance(0);
    const shoulderFlipped = pointOn("fUpperArm", 0)[0];
    const torsoTipFlipped = pointOn("torso", 70);
    ab.delete();
    return { found, samples, shoulderRight, shoulderFlipped, torsoTipFlipped };
  });
  check("all 16 bones found by name", probe.found.length === 16, probe.found.join(","));
  check("draw order: front arm over torso", near(probe.samples.fUpperArm, COLORS.front), JSON.stringify(probe.samples.fUpperArm));
  check("draw order: back arm under torso", near(probe.samples.bUpperArm, COLORS.torso), JSON.stringify(probe.samples.bUpperArm));
  check("draw order: front leg over torso", near(probe.samples.fThighHip, COLORS.front), JSON.stringify(probe.samples.fThighHip));
  check("draw order: back leg under torso", near(probe.samples.bThighUp, COLORS.torso), JSON.stringify(probe.samples.bThighUp));
  check("head drawn", near(probe.samples.head, COLORS.front), JSON.stringify(probe.samples.head));
  check(
    "pelvis scaleX=-1 mirrors the rig",
    Math.abs(probe.shoulderRight - 305) < 0.01 && Math.abs(probe.shoulderFlipped - 295) < 0.01 && Math.abs(probe.torsoTipFlipped[0] - 300) < 0.01,
    `front shoulder x ${probe.shoulderRight.toFixed(2)} -> ${probe.shoulderFlipped.toFixed(2)}`,
  );

  // Layering in the live page: wait for an impact frame, then read pixels.
  await page.waitForFunction(() => window.__rigTest.matches[0].flash && window.__rigTest.matches[0].flash.k < 0.3, null, { timeout: 5000 });
  const layers = await page.evaluate(() => {
    const { matches, view } = window.__rigTest;
    const { dpr, cam } = view();
    const ctx = document.getElementById("stage").getContext("2d");
    const toPx = (x, y) => [Math.round(dpr * (cam.x + cam.s * x)), Math.round(dpr * (cam.y + cam.s * y))];
    const px = ([x, y]) => Array.from(ctx.getImageData(x, y, 1, 1).data.slice(0, 3));
    const m = matches[0];
    const w = m.b.bones.torso.worldTransform();
    const bTorso = [w.tx + w.xx * 35, w.ty + w.xy * 35];
    w.delete();
    return {
      flash: px(toPx(m.flash.x, m.flash.y)),
      bTorso: px(toPx(bTorso[0], bTorso[1])),
      emptyBackground: px(toPx(1000, 260)), // inside the view, above the ropes
    };
  });
  check("2D overlay drawn over Rive (flash at kicking foot is near-white)", layers.flash.every((v) => v > 225), JSON.stringify(layers.flash));
  check("Rive drawn over 2D background (fighter B torso colour)", near(layers.bTorso, COLORS.torso, 30), JSON.stringify(layers.bTorso));
  check("2D background visible where there is no fighter", layers.emptyBackground.every((v) => v < 60), JSON.stringify(layers.emptyBackground));
  await page.screenshot({ path: path.join(outDir, "impact.png") });
  check("no page errors", errors.length === 0, errors.join(" | "));
  await context.close();

  // ---- performance -------------------------------------------------------
  console.log("\nperformance (headless Chromium in this container, 1280x720):");
  for (const rigs of [2, 20, 100]) {
    const s = await openPage(browser, `?rigs=${rigs}`);
    await s.page.waitForTimeout(1000);
    const samples = [];
    for (let i = 0; i < 8; i++) {
      await s.page.waitForTimeout(500);
      samples.push(await s.page.evaluate(() => ({ ...window.__rigTest.stats })));
    }
    const fps = samples.reduce((a, b) => a + b.fps, 0) / samples.length;
    const ms = samples.reduce((a, b) => a + b.frameMs, 0) / samples.length;
    console.log(`  rigs=${String(rigs).padStart(3)}  fps ${fps.toFixed(1)}  JS frame ${ms.toFixed(2)} ms  boot ${samples[0].bootMs.toFixed(0)} ms`);
    if (rigs === 2) await s.page.screenshot({ path: path.join(outDir, "rig-test.png") });
    if (rigs === 20) await s.page.screenshot({ path: path.join(outDir, "rigs-20.png") });
    await s.context.close();
  }

  // ---- iPhone 17 Pro layout (Chromium emulation: size + 3x density only) ---
  console.log("\niPhone 17 Pro emulation (402x874 CSS px @3x; not real WebKit):");
  for (const [name, viewport] of [["portrait", { width: 402, height: 874 }], ["landscape", { width: 874, height: 402 }]]) {
    const s = await openPage(browser, "", { viewport, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
    await s.page.waitForTimeout(1500);
    const info = await s.page.evaluate(() => {
      const { matches, view } = window.__rigTest;
      const { dpr, cam } = view();
      const c = document.getElementById("stage");
      const onScreen = (bone, along) => {
        const w = bone.worldTransform();
        const x = cam.x + cam.s * (w.tx + w.xx * along), y = cam.y + cam.s * (w.ty + w.xy * along);
        w.delete();
        return x >= 0 && x <= c.clientWidth && y >= 0 && y <= c.clientHeight;
      };
      const m = matches[0];
      const visible = ["head", "fFoot", "bFoot", "fHand", "bHand"].every((b) => onScreen(m.a.bones[b], 10) && onScreen(m.b.bones[b], 10));
      return { dpr, canvas: [c.width, c.height], fighterPx: Math.round(220 * cam.s), visible, error: window.__rigTest.error };
    });
    check(`iPhone ${name}: boots at 3x`, !info.error && info.dpr === 3 && info.canvas[0] === viewport.width * 3, `canvas ${info.canvas.join("x")}`);
    check(`iPhone ${name}: both fighters fully on screen`, info.visible, `fighter ~${info.fighterPx} CSS px tall`);
    await s.page.screenshot({ path: path.join(outDir, `iphone-${name}.png`) });

    // Chromium reports no safe-area insets, so simulate the iPhone's
    // (Dynamic Island / home bar, approximate) and check the layout respects them.
    const inset = name === "landscape" ? { top: 0, right: 62, bottom: 21, left: 62 } : { top: 62, right: 0, bottom: 34, left: 0 };
    await s.page.addStyleTag({ content: `#safe { padding: ${inset.top}px ${inset.right}px ${inset.bottom}px ${inset.left}px !important; }` });
    await s.page.evaluate(() => window.dispatchEvent(new Event("resize")));
    await s.page.waitForTimeout(300);
    const safeInfo = await s.page.evaluate(() => {
      const { matches, view } = window.__rigTest;
      const { cam, safe } = view();
      const c = document.getElementById("stage");
      const m = matches[0];
      const xs = [], ys = [];
      for (const f of [m.a, m.b]) for (const b of ["head", "fHand", "bHand", "fFoot", "bFoot"]) {
        const w = f.bones[b].worldTransform();
        xs.push(cam.x + cam.s * w.tx); ys.push(cam.y + cam.s * w.ty);
        w.delete();
      }
      // HUD box (see drawHud) vs. each head circle, sampled over the next second below.
      const compact = c.clientHeight < 500;
      const hud = { x0: safe.left + 10, y0: safe.top + 10, x1: safe.left + 10 + (compact ? 250 : 300), y1: safe.top + 10 + (compact ? 53 : 116) };
      return { safe, hud, minX: Math.min(...xs), maxX: Math.max(...xs), minY: Math.min(...ys), maxY: Math.max(...ys), w: c.clientWidth, h: c.clientHeight };
    });
    const sf = safeInfo.safe;
    check(
      `iPhone ${name}: fighters stay inside simulated safe area`,
      sf.left === inset.left && sf.top === inset.top && safeInfo.minX > sf.left && safeInfo.maxX < safeInfo.w - sf.right && safeInfo.minY > sf.top && safeInfo.maxY < safeInfo.h - sf.bottom,
      `insets ${JSON.stringify(sf)}`,
    );
    let hudHits = 0;
    for (let i = 0; i < 20; i++) {
      await s.page.waitForTimeout(90); // ~2 s: covers a full kick cycle
      hudHits += await s.page.evaluate((hud) => {
        const { matches, view } = window.__rigTest;
        const { cam } = view();
        let hits = 0;
        for (const f of [matches[0].a, matches[0].b]) {
          const w = f.bones.head.worldTransform();
          const cx = cam.x + cam.s * (w.tx + w.xx * 15), cy = cam.y + cam.s * (w.ty + w.xy * 15), r = cam.s * 16;
          w.delete();
          if (cx + r > hud.x0 && cx - r < hud.x1 && cy + r > hud.y0 && cy - r < hud.y1) hits++;
        }
        return hits;
      }, safeInfo.hud);
    }
    check(`iPhone ${name}: FPS box never covers a fighter's head`, hudHits === 0, `${hudHits} overlapping samples`);
    await s.page.screenshot({ path: path.join(outDir, `iphone-${name}-insets.png`) });
    await s.context.close();
  }

  await browser.close();
  const failed = results.filter((r) => !r.ok);
  console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
  process.exit(failed.length ? 1 : 0);
})();
