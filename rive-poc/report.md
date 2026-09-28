# Rive fighter rig test: report

28 September 2026

## Summary

- **It works.** The game's own code can move every bone of a Rive character
  every frame, and Rive just draws it. The first method tried, setting bone
  rotations directly from JavaScript, worked, so none of the fallback methods
  were needed.
- **It's fast on the iPhone 17 Pro.** 20 fighters ran at 60 frames per second
  (the maximum), using 7 ms of the 16.7 ms available per frame. A real match
  has 2 fighters, which used about 1.5 ms. That leaves plenty of room for
  painted artwork.
- **One difference from the plan.** The rig was not built in the Rive editor,
  because no Rive editor connection (MCP) was available. The `.riv` file was
  written directly, following Rive's file format. The real Rive runtime loads
  and draws it correctly, but it has never been opened in the Rive editor.

## What's in this zip

| File | What it is |
| --- | --- |
| `rig-test.html` | The test page. Double-click it on the Mac to open it in a browser. It works offline and makes no network requests. The buttons at the bottom right switch between 2, 20 and 100 fighters, and between 3×, 2× and 1× resolution. |
| `fighter-rig-test.riv` | The placeholder rig: artboard `Fighter`, 600×600, 16 bones, 15 shapes. |
| `report.md` | This report. |

On the iPhone, opening `rig-test.html` from the Files app, or as an attachment
in the Claude app, only shows its code. To run it on the phone, use the
private published copy: https://claude.ai/artifact/D5YcyhbbE3xVeh7dCbxyLY

## 1. The rig (`fighter-rig-test.riv`)

- Artboard `Fighter`, 600×600. The character faces right and its heel touches
  the bottom edge (y = 600) in the rest pose.
- Artboard clipping is off, so the fighter can be drawn anywhere in the game
  world.
- Every body part is a capsule (a rounded rectangle) or a circle attached to
  one bone, with a 2 px dark outline.
- Colours:
  - Front ("f") limbs and the head: light `#F2D0A9`.
  - Back ("b") limbs: dark `#8A5A3C`.
  - Torso: blue `#2F6FDE`.
- Draw order, back to front: back arm, back leg, torso, front leg, head (with
  the neck), front arm. Within each limb the hand or foot is on top.

### Bones

| Bone | Type | Parent | Length (px) | Position | Rest rotation |
| --- | --- | --- | --- | --- | --- |
| `pelvis` | root bone | artboard | 0 | x 300, y 493 | 0° |
| `torso` | bone | pelvis | 70 | at the pelvis | −90° (up) |
| `neck` | bone | torso | 8 | torso tip | 0° |
| `head` | bone | neck | 30 (circle r15 centred on it) | neck tip | 0° |
| `fUpperArm` | root bone | torso | 36 | 5 px back from the torso tip, 5 px forward | 180° (hanging) |
| `fForearm` | bone | fUpperArm | 34 | tip | 0° |
| `fHand` | bone | fForearm | 20 (glove r10 centred on it) | tip | 0° |
| `bUpperArm` | root bone | torso | 36 | 5 px back from the torso tip, 6 px backward | 180° |
| `bForearm` | bone | bUpperArm | 34 | tip | 0° |
| `bHand` | bone | bForearm | 20 (glove r10) | tip | 0° |
| `fThigh` | root bone | pelvis | 47 | 4 px below the pelvis, 5 px forward | 90° (down) |
| `fShin` | bone | fThigh | 48 | tip | 0° |
| `fFoot` | bone | fShin | 17 | tip | −90° (forward) |
| `bThigh` | root bone | pelvis | 47 | 4 px below the pelvis, 4 px backward | 90° |
| `bShin` | bone | bThigh | 48 | tip | 0° |
| `bFoot` | bone | bShin | 17 | tip | −90° |

Choices made where the spec was open:

- **Head and hand lengths.** The spec gave none, so each bone is as long as
  its circle's diameter (head 30, hands 20), with the circle centred on the
  bone.
- **Shoulders and hips are "root bones".** In Rive a normal bone always starts
  at its parent's tip. Only a root bone can sit at an offset like "5 px back
  from the torso tip".

## 2. The test page (`rig-test.html`)

- Uses Rive's low-level web runtime, `@rive-app/canvas-advanced` version
  2.43.1.
- Every frame, JavaScript sets:
  - All 16 bone rotations.
  - The pelvis x/y position.
  - The facing direction, by setting the pelvis `scaleX` to 1 or −1.
- Two fighters face each other.
  - Every joint moves with sine waves.
  - The left fighter throws a repeating roundhouse kick: the thigh rises
    80–100°, then the shin extends.
  - The right fighter recoils when hit.
- Everything is drawn in one canvas, in this order:
  1. A 2D background (arena, ropes, floor shadows).
  2. The Rive fighters.
  3. A 2D overlay (the impact flash and the FPS counter).
- The page is fully self-contained. The Rive runtime code, its WebAssembly
  file and the `.riv` rig are inlined, the last two as base64.
- The FPS counter also shows:
  - The milliseconds of work per frame.
  - The resolution.
  - A cross-check: the page computes the kicking foot's position itself and
    compares it with Rive's ("FK 0.000" means they agree).

## 3. Which method worked

**Direct bone access.** Each frame the page calls
`artboard.bone("fThigh").rotation = angleInRadians`, then
`artboard.advance(dt)` and `artboard.draw(renderer)`. No animation, state
machine or view model is involved. So the fallbacks weren't tried:

- (a) view-model number properties
- (b) state-machine blend inputs
- (c) Rive scripting

## 4. Rotation convention

- **Units: radians.** The Rive editor shows degrees, but code sets radians
  (degrees × π / 180).
- **Direction: clockwise is positive** on screen, because Rive's y axis points
  down. 0 means the bone points the same way as its parent.
- **Relative to the parent bone: yes.** Each bone's rotation is added to its
  parent's, and each bone starts at its parent's tip.
- **Setting a rotation replaces the rest value** stored in the file. It is not
  added to it.
- **Converting from absolute angles.** If the game works in absolute angles
  (character facing right, 0° = forward, 90° = down), use
  `rotation = (childAngle − parentAngle) × π / 180`. The pelvis uses its own
  angle.
- **Facing.** `pelvis.scaleX = −1` mirrors the whole fighter, so the game uses
  the same angles for both directions. The front limbs stay drawn in front.

Every frame, the page checks this convention against Rive. It computes the
foot's position from the angles it set and compares that with Rive's own. They
agreed to within 0.001 px throughout.

## 5. Final bone names

`pelvis`, `torso`, `neck`, `head`, `fUpperArm`, `fForearm`, `fHand`,
`bUpperArm`, `bForearm`, `bHand`, `fThigh`, `fShin`, `fFoot`, `bThigh`,
`bShin`, `bFoot`

## 6. Measured performance

### iPhone 17 Pro

Measured by the owner, with the page opened in the Claude app, the phone in
landscape and 3× resolution:

| Fighters | Frames per second | Work per frame |
| --- | --- | --- |
| 2 | 30.0 (see note) | 1.53 ms |
| 20 | 59.8 | 7.00 ms |

A 60 fps frame allows 16.7 ms. With 2 fighters the page used only 1.53 ms, so
the fighters did not cause the 30 fps reading. The likely causes:

- **The page hadn't been tapped yet.** iPhones slow a page embedded in another
  app to 30 fps until it's tapped. The 20-fighter reading came after tapping a
  button.
- **Low Power Mode** also limits pages to 30 fps.

Neither applies to the game's own web view once the player has touched the
screen.

### Mac

Not measured, because the testing ran on a cloud computer. To measure,
double-click `rig-test.html` on the Mac and read the counter in the top-left
corner.

### Cloud test computer

For reference only. This was headless Chromium with software rendering, no
GPU, at 1280×720:

| Fighters | Frames per second | Work per frame |
| --- | --- | --- |
| 2 | 60 | ~0.5 ms |
| 20 | 60 | ~2–4 ms |
| 100 | ~30–45 | ~12–18 ms |

Startup, from opening the page to the first frame, took about 115–195 ms.

## 7. Automated checks

The checks ran in headless Chromium with the network switched off. **All 23
passed.**

Loading:

- The page starts with no network access.
- The page makes no requests besides itself.
- All 16 bones are found by name.
- No errors occur.

Rotation convention:

- Rive's foot position matches the page's own calculation (error 0.0000 px).

Draw order, checked by reading pixel colours:

- The front arm is drawn over the torso.
- The back arm is drawn under the torso.
- The front leg is drawn over the torso.
- The back leg is drawn under the torso.
- The head is drawn.

Facing:

- `pelvis.scaleX = −1` mirrors the rig (the front shoulder moves from x 305
  to x 295).

Layering in one canvas:

- The 2D background shows where there's no fighter.
- Rive is drawn over the 2D background.
- The 2D impact flash is drawn over Rive.

iPhone 17 Pro layout, emulated at 402×874 and 3×:

| Check | Portrait | Landscape |
| --- | --- | --- |
| Starts at full 3× resolution | passed | passed |
| Both fighters fully on screen | passed | passed |
| Fighters stay clear of the Dynamic Island and home bar (simulated) | passed | passed |
| FPS box never covers a fighter's head | passed | passed |

Buttons:

- The buttons switch the resolution and the fighter count.

On the real iPhone 17 Pro, the published copy of the page ran in the Claude
app, so it also works in Apple's browser engine (WebKit).

## 8. Limits and gotchas

1. **Rive's drawing is delayed.** `artboard.draw()` only queues drawing. It
   reaches the canvas when `rive.resolveAnimationFrame()` is called, and only
   if `renderer.beginFrame(false)` was called that frame. Without that call,
   nothing appears.
   - The order that mixes the game's drawing with Rive's is: 2D background,
     then Rive, then `resolveAnimationFrame()`, then the 2D overlay.
2. **`beginFrame()` clears the canvas by default.** Pass `false`, or it wipes
   the background you just drew.
3. **Reset the canvas transform before `resolveAnimationFrame()`.** Rive draws
   on top of whatever transform the canvas has. Apply the camera with
   `renderer.transform(...)`.
4. **Turn off artboard clipping** in the editor. The editor turns it on by
   default, and a fighter outside the artboard's box would disappear.
5. **Shoulders and hips need root bones.** When building the real rig in the
   editor:
   - Start a new bone chain for each arm and leg.
   - Attach the first bone of each chain to the torso or pelvis.
6. **Free Rive objects.**
   - `bone.worldTransform()` returns an object that must be `.delete()`d, or
     it leaks memory every frame.
   - Call `artboard.delete()` when a fighter is removed.
7. **Call `artboard.advance(dt)` after setting the bones and before drawing.**
   No animation or state machine is needed.
8. **Pass `false` as the third argument to `rive.load()`.** Otherwise Rive may
   try to download assets from its website.
9. **Painted artwork.** There are two ways to attach images to bones:
   - Rigid images that move with a bone should stay fast.
   - Images that bend across joints (mesh deformation) take an extra step in
     this runtime, according to its source code. Measure them on the iPhone
     once real art exists.
   Rive's faster WebGL runtime can't share a canvas with the game's own 2D
   drawing. Using it would mean stacking separate canvases.
10. **Content Security Policy.** If the iPhone app's web view sets one, it must
    allow `'wasm-unsafe-eval'` and inline scripts.
11. **120 Hz.** The iPhone 17 Pro screen is 120 Hz, but pages usually run at
    60 fps at most. That matches the game's 60 steps per second.
12. **File attachments show code.** Opening the HTML file from the Files app
    or as a Claude app attachment shows its code instead of running it. Use a
    browser, the published link, or the game's own web view.

## 9. How the game code uses it

```js
const rive = await RiveCanvasAdvanced({ instantiateWasm(imports, done) {
  WebAssembly.instantiate(wasmBytes, imports).then(r => done(r.instance, r.module));
  return {};
}});
const file = await rive.load(rivBytes, undefined, false);
const artboard = file.artboardByName("Fighter");     // one per fighter
const bones = Object.fromEntries(BONE_NAMES.map(n => [n, artboard.bone(n)]));
const pelvis = artboard.rootBone("pelvis");
const renderer = rive.makeRenderer(canvas);

function frame(dt) {
  for (const n of BONE_NAMES) bones[n].rotation = angleRadians[n];
  pelvis.x = x; pelvis.y = y; pelvis.scaleX = facing;  // facing: 1 or -1
  artboard.advance(dt);

  drawBackground(ctx);                                 // game's 2D drawing
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  renderer.beginFrame(false);
  renderer.save();
  renderer.transform(scale, 0, 0, scale, camX, camY);
  artboard.draw(renderer);
  renderer.restore();
  rive.resolveAnimationFrame();                        // Rive paints here
  drawOverlay(ctx);                                    // game's 2D drawing
}
```

## 10. Next steps

1. **Connect Rive to the game.** Replace the game's current fighter drawing
   with this rig, converting the game's joint angles as described in
   section 4.
2. **Painted artwork.** Rebuild the rig in the Rive editor with painted
   images, keeping the same 16 bone names and hierarchy, so no code changes
   are needed.
3. **Re-measure on the iPhone** with the painted artwork, especially if the
   images bend across joints.
