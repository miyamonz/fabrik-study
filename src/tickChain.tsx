import { WorldPosition } from "./Transform";
import { movePoint } from "./movePoint";
import { chainLengths } from "./App";

type Position = { x: number; y: number };
type RotationLimits = Record<number, [min: number, max: number]>;

export function tickChain(
  start: WorldPosition,
  end: WorldPosition,
  chain: WorldPosition[],
  rotationLimits?: RotationLimits
): WorldPosition[] {
  const newPosArr = forward(end, chain, chainLengths, rotationLimits);

  return backward(start, newPosArr, chainLengths, rotationLimits);
}
function forward(
  start: WorldPosition,
  _chain: readonly WorldPosition[],
  chainLens: readonly number[],
  rotationLimits?: RotationLimits
): WorldPosition[] {
  const chain = [..._chain];
  chain[chain.length - 1] = start;
  for (let i = chain.length - 2; i >= 0; i--) {
    const prev = chain[i + 2];
    const curr = chain[i + 1];
    const next = chain[i];
    const len = chainLens[i];

    const newPoint = movePoint(curr, next, len) as WorldPosition;

    chain[i] = newPoint;
  }
  return chain;
}
function backward(
  start: WorldPosition,
  _chain: readonly WorldPosition[],
  chainLens: readonly number[],
  rotationLimits?: RotationLimits
): WorldPosition[] {
  const chain = [..._chain];
  chain[0] = start;
  for (let i = 1; i < chain.length; i++) {
    const prev = chain[i - 2];
    const curr = chain[i - 1];
    const next = chain[i];
    const len = chainLens[i - 1];
    const prevVec = {
      x: curr.x - (prev?.x ?? 0),
      y: curr.y - (prev?.y ?? 0),
    };
    const nextVec = {
      x: next.x - curr.x,
      y: next.y - curr.y,
    };

    //関節の角度は、前後の点によって定める。-PI ~ PI
    const prevAngle = Math.atan2(prevVec.y, prevVec.x);
    const angle = getAngleBetween2Vector(prevVec, nextVec);

    const limit = rotationLimits?.[i - 1];
    const limitedAngle = limit
      ? Math.max(limit[0], Math.min(limit[1], angle))
      : angle;
    const newOffset = rotate({ x: len, y: 0 }, prevAngle + limitedAngle);

    chain[i] = {
      x: curr.x + newOffset.x,
      y: curr.y + newOffset.y,
    } as WorldPosition;
  }
  return chain;
}

function getAngleBetween2Vector(prevVec: Position, nextVec: Position): number {
  const theta =
    Math.atan2(nextVec.y, nextVec.x) - Math.atan2(prevVec.y, prevVec.x);
  if (theta < -Math.PI) {
    return theta + Math.PI * 2;
  } else if (theta > Math.PI) {
    return theta - Math.PI * 2;
  }
  return theta;
}

function rotate(v: Position, rotation: number) {
  return {
    x: v.x * Math.cos(rotation) - v.y * Math.sin(rotation),
    y: v.x * Math.sin(rotation) + v.y * Math.cos(rotation),
  };
}
