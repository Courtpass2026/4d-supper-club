// Builds fighter-rig-test.riv: a 600x600 placeholder fighter rig with named
// bones and one capsule/circle shape parented to each bone.
//
//   node tools/build-rig.mjs            -> ../fighter-rig-test.riv
//
// Rive conventions baked in here (and relied on by rig-test.html):
//   - y points down, rotations are radians, positive = clockwise on screen
//   - every bone rotation is relative to its parent bone
//   - a Bone starts at its parent bone's tip; a RootBone has its own x/y in
//     the parent's space, which is how the shoulders and hips are offset

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { TYPE, PROP, encodeRiv } from "./riv-writer.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const OUT = join(here, "..", "fighter-rig-test.riv");

const PI = Math.PI;
const ARTBOARD = { name: "Fighter", width: 600, height: 600 };

const COLOR = {
  front: 0xfff2d0a9, // light: "f" limbs + head
  back: 0xff8a5a3c, // darker: "b" limbs
  torso: 0xff2f6fde, // third colour: torso
  outline: 0xff1b1b1f,
};

// Capsule thickness per bone (px). Capsules run from the bone's base to its
// tip with round ends centred on the joints.
const THICK = {
  neck: 12,
  upperArm: 14,
  forearm: 12,
  thigh: 20,
  shin: 16,
  foot: 10,
};
const HEAD_R = 15;
const GLOVE_R = 10;

// Lowest point of the rest pose below the pelvis: hip drop + thigh + shin +
// the shin's round end (thicker than the foot's), so the heel touches y=600.
const PELVIS_Y =
  ARTBOARD.height - (4 + 47 + 48 + Math.max(THICK.shin, THICK.foot) / 2);

// Rest pose: facing right, standing, arms hanging, feet pointing forward.
// kind: "root" = RootBone (own x/y), "bone" = Bone (starts at parent tip).
const BONES = [
  { name: "pelvis", kind: "root", parent: null, x: 300, y: PELVIS_Y, rot: 0, length: 0 },
  { name: "torso", kind: "bone", parent: "pelvis", rot: -PI / 2, length: 70 },
  { name: "neck", kind: "bone", parent: "torso", rot: 0, length: 8 },
  { name: "head", kind: "bone", parent: "neck", rot: 0, length: 2 * HEAD_R },

  // Shoulders: torso tip minus 5px along the torso. Torso-local +y is the
  // facing direction, so "forward" is +y and "backward" is -y.
  { name: "fUpperArm", kind: "root", parent: "torso", x: 70 - 5, y: 5, rot: PI, length: 36 },
  { name: "fForearm", kind: "bone", parent: "fUpperArm", rot: 0, length: 34 },
  { name: "fHand", kind: "bone", parent: "fForearm", rot: 0, length: 2 * GLOVE_R },
  { name: "bUpperArm", kind: "root", parent: "torso", x: 70 - 5, y: -6, rot: PI, length: 36 },
  { name: "bForearm", kind: "bone", parent: "bUpperArm", rot: 0, length: 34 },
  { name: "bHand", kind: "bone", parent: "bForearm", rot: 0, length: 2 * GLOVE_R },

  // Hips: 4px below the pelvis (pelvis-local +y is down, +x is forward).
  { name: "fThigh", kind: "root", parent: "pelvis", x: 5, y: 4, rot: PI / 2, length: 47 },
  { name: "fShin", kind: "bone", parent: "fThigh", rot: 0, length: 48 },
  { name: "fFoot", kind: "bone", parent: "fShin", rot: -PI / 2, length: 17 },
  { name: "bThigh", kind: "root", parent: "pelvis", x: -4, y: 4, rot: PI / 2, length: 47 },
  { name: "bShin", kind: "bone", parent: "bThigh", rot: 0, length: 48 },
  { name: "bFoot", kind: "bone", parent: "bShin", rot: -PI / 2, length: 17 },
];

const capsule = (bone, thickness, color) => ({ bone, shape: "capsule", thickness, color });
const circle = (bone, radius, color) => ({ bone, shape: "circle", radius, color });
const torsoBox = { bone: "torso", shape: "torso", color: COLOR.torso };

// Draw order, back to front: back arm, back leg, torso, front leg, head,
// front arm. Rive draws the FIRST drawable in the file on top, so the list
// below is written front to back.
const SHAPES = [
  // front arm
  circle("fHand", GLOVE_R, COLOR.front),
  capsule("fForearm", THICK.forearm, COLOR.front),
  capsule("fUpperArm", THICK.upperArm, COLOR.front),
  // head
  circle("head", HEAD_R, COLOR.front),
  capsule("neck", THICK.neck, COLOR.front),
  // front leg
  capsule("fFoot", THICK.foot, COLOR.front),
  capsule("fShin", THICK.shin, COLOR.front),
  capsule("fThigh", THICK.thigh, COLOR.front),
  // torso
  torsoBox,
  // back leg
  capsule("bFoot", THICK.foot, COLOR.back),
  capsule("bShin", THICK.shin, COLOR.back),
  capsule("bThigh", THICK.thigh, COLOR.back),
  // back arm
  circle("bHand", GLOVE_R, COLOR.back),
  capsule("bForearm", THICK.forearm, COLOR.back),
  capsule("bUpperArm", THICK.upperArm, COLOR.back),
];

// ---------------------------------------------------------------------------

const objects = [{ type: TYPE.Backboard }];
const artboardObjects = [];
const index = new Map(); // name -> index in the artboard's object list

function add(type, props, key) {
  artboardObjects.push({ type, props });
  const i = artboardObjects.length - 1;
  if (key) index.set(key, i);
  return i;
}

add(
  TYPE.Artboard,
  [
    [PROP.name, ARTBOARD.name],
    [PROP.width, ARTBOARD.width],
    [PROP.height, ARTBOARD.height],
    [PROP.clip, false], // let the fighter draw outside its 600x600 box
  ],
  "@artboard",
);

const byName = new Map(BONES.map((b) => [b.name, b]));
for (const b of BONES) {
  const parentId = b.parent ? index.get(b.parent) : index.get("@artboard");
  const props = [
    [PROP.name, b.name],
    [PROP.parentId, parentId],
    [PROP.rotation, b.rot],
  ];
  if (b.length) props.push([PROP.boneLength, b.length]);
  if (b.kind === "root") {
    props.push([PROP.rootX, b.x], [PROP.rootY, b.y]);
    add(TYPE.RootBone, props, b.name);
  } else {
    add(TYPE.Bone, props, b.name);
  }
}

function addPaints(shapeId, color) {
  const fill = add(TYPE.Fill, [[PROP.parentId, shapeId]]);
  add(TYPE.SolidColor, [[PROP.parentId, fill], [PROP.color, color]]);
  const stroke = add(TYPE.Stroke, [
    [PROP.parentId, shapeId],
    [PROP.thickness, 2],
    [PROP.cap, 1], // round
    [PROP.join, 1], // round
  ]);
  add(TYPE.SolidColor, [[PROP.parentId, stroke], [PROP.color, COLOR.outline]]);
}

for (const s of SHAPES) {
  const bone = byName.get(s.bone);
  const L = bone.length;
  const shapeProps = (x) => [
    [PROP.name, `${s.bone}Shape`],
    [PROP.parentId, index.get(s.bone)],
    [PROP.x, x],
    [PROP.y, 0],
  ];

  if (s.shape === "capsule") {
    const shape = add(TYPE.Shape, shapeProps(L / 2));
    add(TYPE.Rectangle, [
      [PROP.parentId, shape],
      [PROP.pathWidth, L + s.thickness],
      [PROP.pathHeight, s.thickness],
      [PROP.linkCornerRadius, true],
      [PROP.cornerRadius, s.thickness / 2],
    ]);
    addPaints(shape, s.color);
  } else if (s.shape === "circle") {
    const shape = add(TYPE.Shape, shapeProps(L / 2));
    add(TYPE.Ellipse, [
      [PROP.parentId, shape],
      [PROP.pathWidth, 2 * s.radius],
      [PROP.pathHeight, 2 * s.radius],
    ]);
    addPaints(shape, s.color);
  } else if (s.shape === "torso") {
    // Rounded box from 8px below the pelvis to 4px past the torso tip.
    const from = -8;
    const to = L + 4;
    const shape = add(TYPE.Shape, shapeProps((from + to) / 2));
    add(TYPE.Rectangle, [
      [PROP.parentId, shape],
      [PROP.pathWidth, to - from],
      [PROP.pathHeight, 32],
      [PROP.linkCornerRadius, true],
      [PROP.cornerRadius, 10],
    ]);
    addPaints(shape, s.color);
  }
}

objects.push(...artboardObjects);
const bytes = encodeRiv(objects);
writeFileSync(OUT, bytes);

console.log(
  `wrote ${OUT} (${bytes.length} bytes, ${BONES.length} bones, ${SHAPES.length} shapes, pelvis y=${PELVIS_Y})`,
);
