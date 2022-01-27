import type {
  Position,
  WorldPosition,
  WorldRotation,
  LocalPosition,
  LocalRotation,
} from "./types";

const addRot = (from: WorldRotation, to: LocalRotation): WorldRotation =>
  (from + to) as WorldRotation;

export type LocalTransform = {
  localPos: LocalPosition;
  localRot: LocalRotation;
};

export type WorldTransform = {
  worldPos: WorldPosition;
  worldRot: WorldRotation;
};

export function localToWorld(
  localTransforms: LocalTransform[]
): WorldTransform[] {
  function* gen(): IterableIterator<WorldTransform> {
    let lastPos: WorldPosition = { x: 0, y: 0 } as WorldPosition;
    let lastRot: WorldRotation = 0 as WorldRotation;
    for (const { localPos, localRot } of localTransforms) {
      const worldRot = addRot(lastRot, localRot);

      const offset = rotate(localPos, worldRot);
      const worldPos = {
        x: lastPos.x + offset.x,
        y: lastPos.y + offset.y,
      } as WorldPosition;
      yield { worldPos, worldRot };
      lastPos = worldPos;
      lastRot = worldRot;
    }
  }
  return [...gen()];
}

function rotate(v: Position, rotation: number) {
  return {
    x: v.x * Math.cos(rotation) - v.y * Math.sin(rotation),
    y: v.x * Math.sin(rotation) + v.y * Math.cos(rotation),
  };
}

export function worldPosToLocalPos(
  worldPositions: WorldPosition[]
): LocalPosition[] {
  function* gen(): IterableIterator<LocalPosition> {
    let lastPos: WorldPosition = { x: 0, y: 0 } as WorldPosition;
    for (const worldPos of worldPositions) {
      const localPos = {
        x: worldPos.x - lastPos.x,
        y: worldPos.y - lastPos.y,
      } as LocalPosition;

      yield localPos;
      lastPos = worldPos;
    }
  }
  return [...gen()];
}

export function worldPosToLocalTransform(
  worldPosArr: WorldPosition[]
): LocalTransform[] {
  function* gen(): IterableIterator<LocalTransform> {
    let lastPos: WorldPosition = { x: 0, y: 0 } as WorldPosition;
    let lastRot: WorldRotation = 0 as WorldRotation;

    for (const worldPos of worldPosArr) {
      const nextWorldPos = worldPosArr[worldPosArr.indexOf(worldPos) + 1];

      const worldRot = (
        nextWorldPos
          ? Math.atan2(nextWorldPos.y - worldPos.y, nextWorldPos.x - worldPos.x)
          : lastRot
      ) as WorldRotation;

      const localRot = (worldRot - lastRot) as LocalRotation;
      const localPos = {
        x: Math.hypot(worldPos.x - lastPos.x, worldPos.y - lastPos.y),
        y: 0,
      } as LocalPosition;
      const localTransform = {
        localPos,
        localRot,
      } as LocalTransform;
      yield localTransform;

      lastPos = worldPos;
      lastRot = worldRot;
    }
  }
  return [...gen()];
}
