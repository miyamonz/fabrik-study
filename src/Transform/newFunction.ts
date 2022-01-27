import { WorldTransform, LocalTransform } from "./Transform";
import { Position, WorldPosition } from "./types";
export function newWorldPosition(position: Position) {
  return {
    x: position.x,
    y: position.y,
  } as WorldPosition;
}
export function newWorldTransform(
  worldPos: Position,
  worldRot: number
): WorldTransform {
  return { worldPos, worldRot } as WorldTransform;
}
export function newLocalTransform(
  localPos: Position,
  localRot: number
): LocalTransform {
  return { localPos, localRot } as LocalTransform;
}
