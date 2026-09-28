// Minimal writer for Rive's runtime binary format (.riv, major version 7).
//
// Layout: "RIVE" fingerprint, varuint major, varuint minor, varuint file id,
// property table-of-contents (empty here: every key we write is one the
// runtime already knows), then a flat list of objects. Each object is a
// varuint type key followed by (varuint property key, value) pairs and a 0
// terminator. Keys and field types come from rive-runtime's generated headers
// (include/rive/generated/**/*_base.hpp).

export const TYPE = {
  Backboard: 23,
  Artboard: 1,
  Node: 2,
  Shape: 3,
  Ellipse: 4,
  Rectangle: 7,
  SolidColor: 18,
  Fill: 20,
  Stroke: 24,
  Bone: 40,
  RootBone: 41,
};

// propertyKey -> field type
const FIELD = {
  4: "string", // Component.name
  5: "uint", // Component.parentId (index into the artboard's object list)
  7: "double", // LayoutComponent.width
  8: "double", // LayoutComponent.height
  196: "bool", // LayoutComponent.clip
  13: "double", // Node.x
  14: "double", // Node.y
  15: "double", // TransformComponent.rotation (radians)
  16: "double", // TransformComponent.scaleX
  17: "double", // TransformComponent.scaleY
  18: "double", // WorldTransformComponent.opacity
  20: "double", // ParametricPath.width
  21: "double", // ParametricPath.height
  31: "double", // Rectangle.cornerRadiusTL
  164: "bool", // Rectangle.linkCornerRadius
  37: "color", // SolidColor.colorValue (ARGB)
  40: "uint", // Fill.fillRule
  47: "double", // Stroke.thickness
  48: "uint", // Stroke.cap
  49: "uint", // Stroke.join
  89: "double", // Bone.length
  90: "double", // RootBone.x
  91: "double", // RootBone.y
};

export const PROP = {
  name: 4,
  parentId: 5,
  width: 7,
  height: 8,
  clip: 196,
  x: 13,
  y: 14,
  rotation: 15,
  scaleX: 16,
  scaleY: 17,
  opacity: 18,
  pathWidth: 20,
  pathHeight: 21,
  cornerRadius: 31,
  linkCornerRadius: 164,
  color: 37,
  fillRule: 40,
  thickness: 47,
  cap: 48,
  join: 49,
  boneLength: 89,
  rootX: 90,
  rootY: 91,
};

class ByteWriter {
  constructor() {
    this.bytes = [];
  }
  byte(b) {
    this.bytes.push(b & 0xff);
  }
  varuint(n) {
    if (!Number.isInteger(n) || n < 0) throw new Error(`bad varuint ${n}`);
    do {
      let b = n % 128;
      n = Math.floor(n / 128);
      if (n > 0) b |= 0x80;
      this.byte(b);
    } while (n > 0);
  }
  float32(v) {
    const buf = new DataView(new ArrayBuffer(4));
    buf.setFloat32(0, v, true);
    for (let i = 0; i < 4; i++) this.byte(buf.getUint8(i));
  }
  uint32(v) {
    const buf = new DataView(new ArrayBuffer(4));
    buf.setUint32(0, v >>> 0, true);
    for (let i = 0; i < 4; i++) this.byte(buf.getUint8(i));
  }
  string(s) {
    const utf8 = new TextEncoder().encode(s);
    this.varuint(utf8.length);
    for (const b of utf8) this.byte(b);
  }
  toUint8Array() {
    return Uint8Array.from(this.bytes);
  }
}

/**
 * Encodes a list of objects: [{ type, props: [[propertyKey, value], ...] }].
 * The Backboard must be first, then each Artboard followed by its objects.
 */
export function encodeRiv(objects, { major = 7, minor = 0, fileId = 0 } = {}) {
  const w = new ByteWriter();
  for (const c of "RIVE") w.byte(c.charCodeAt(0));
  w.varuint(major);
  w.varuint(minor);
  w.varuint(fileId);
  w.varuint(0); // empty property ToC

  for (const obj of objects) {
    w.varuint(obj.type);
    for (const [key, value] of obj.props ?? []) {
      const field = FIELD[key];
      if (!field) throw new Error(`no field type for property ${key}`);
      w.varuint(key);
      switch (field) {
        case "uint":
          w.varuint(value);
          break;
        case "double":
          w.float32(value);
          break;
        case "string":
          w.string(value);
          break;
        case "color":
          w.uint32(value);
          break;
        case "bool":
          w.byte(value ? 1 : 0);
          break;
      }
    }
    w.varuint(0);
  }
  return w.toUint8Array();
}
