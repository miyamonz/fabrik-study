import type { Position, LotationLimit } from "./Transform/Transform";

export function movePoint(
  bone1: Position,
  bone2: Position,
  chainLen: number,
  limit?: LotationLimit
): Position {
  const p1 = bone1;
  const p2 = bone2;

  let v = {
    x: p2.x - p1.x,
    y: p2.y - p1.y,
  };
  const angle = Math.atan2(v.y, v.x);
  if (limit) {
    const [min, max] = limit;
    const newAngle = Math.min(max, Math.max(min, angle));
    const newV = rotate(v, newAngle - angle);
    v = newV;
  }
  const len = Math.hypot(v.x, v.y);
  const nv = {
    x: v.x / len,
    y: v.y / len,
  };
  return {
    x: p1.x + nv.x * chainLen,
    y: p1.y + nv.y * chainLen,
  };
}
function rotate(v: Position, rotation: number) {
  return {
    x: v.x * Math.cos(rotation) - v.y * Math.sin(rotation),
    y: v.x * Math.sin(rotation) + v.y * Math.cos(rotation),
  };
}
