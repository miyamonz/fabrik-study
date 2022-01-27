import { WorldPosition } from "./Transform";
import { movePoint } from "./movePoint";
import { chainLengths } from "./App";

type Position = { x: number; y: number };

export function tickChain(
  start: WorldPosition,
  end: WorldPosition,
  chain: WorldPosition[]
): WorldPosition[] {
  //backward
  const newPos = backward(end, chain, chainLengths);
  //forward
  return forward(start, newPos, chainLengths);
}
function backward(
  start: WorldPosition,
  _chain: readonly WorldPosition[],
  chainLens: readonly number[]
): WorldPosition[] {
  const chain = [..._chain];
  chain[chain.length - 1] = start;
  for (let i = chain.length - 2; i >= 0; i--) {
    const prev = chain[i + 1];
    const next = chain[i];
    const len = chainLens[i];
    const newPoint = movePoint(prev, next, len) as WorldPosition;
    chain[i] = newPoint;
  }
  return chain;
}
function forward(
  start: WorldPosition,
  _chain: readonly WorldPosition[],
  chainLens: readonly number[]
): WorldPosition[] {
  const chain = [..._chain];
  chain[0] = start;
  for (let i = 1; i < chain.length; i++) {
    const prev = chain[i - 1];
    const next = chain[i];
    const len = chainLens[i - 1];
    const newPoint = movePoint(prev, next, len) as WorldPosition;

    chain[i] = newPoint;
  }
  return chain;
}

export function rotate(v: Position, rotation: number) {
  return {
    x: v.x * Math.cos(rotation) - v.y * Math.sin(rotation),
    y: v.x * Math.sin(rotation) + v.y * Math.cos(rotation),
  };
}
