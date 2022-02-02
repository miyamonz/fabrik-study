import { WorldPosition, WorldRotation } from "./Transform";
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
    const offset = {
      x: curr.x - prev?.x,
      y: curr.y - prev?.y,
    };
    const limit =
      rotationLimits && prev
        ? (rotationLimits[i + 1]?.map(
            (r) => r + Math.atan2(offset.y, offset.x)
          ) as [WorldRotation, WorldRotation])
        : undefined;

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
    const offset = {
      x: curr.x - prev?.x,
      y: curr.y - prev?.y,
    };
    const limit = rotationLimits && prev ? rotationLimits[i - 1] : undefined;
    let newPoint = movePoint(curr, next, len) as WorldPosition;

    //limitはここで使ったほうが良い
    if (limit) {
      const nextOffset = {
        x: newPoint.x - curr.x,
        y: newPoint.y - curr.y,
      };
      const newAngle = getDiffAngle(offset, nextOffset, limit);
      const newOffset = rotate(nextOffset, newAngle) as WorldPosition;
      newPoint = {
        x: curr.x + newOffset.x,
        y: curr.y + newOffset.y,
      } as WorldPosition;
    }
    chain[i] = newPoint;
  }
  return chain;
}

function getDiffAngle(
  prevVec: Position,
  nextVec: Position,
  [min, max]: [min: number, max: number]
): number {
  const outerProduct = prevVec.x * nextVec.y - prevVec.y * nextVec.x;
  const prevLen = Math.hypot(prevVec.x, prevVec.y);
  const nextLen = Math.hypot(nextVec.x, nextVec.y);
  const sin = outerProduct / (prevLen * nextLen);
  const angle = Math.asin(sin);

  if (angle < min) {
    return min - angle;
  } else if (angle > max) {
    return max - angle;
  } else {
    return 0;
  }
}

function rotate(v: Position, rotation: number) {
  return {
    x: v.x * Math.cos(rotation) - v.y * Math.sin(rotation),
    y: v.x * Math.sin(rotation) + v.y * Math.cos(rotation),
  };
}
