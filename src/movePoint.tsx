import type { Position } from "./Transform";

export function movePoint(
  bone1: Position,
  bone2: Position,
  chainLen: number
): Position {
  const p1 = bone1;
  const p2 = bone2;

  let v = {
    x: p2.x - p1.x,
    y: p2.y - p1.y,
  };
  const len = Math.hypot(v.x, v.y);

  return {
    x: p1.x + (v.x * chainLen) / len,
    y: p1.y + (v.y * chainLen) / len,
  };
}
