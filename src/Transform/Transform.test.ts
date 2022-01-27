import { worldPosToLocalPos, localToWorld } from "./Transform";
import type { WorldTransform, LocalTransform } from "./Transform";
import { newWorldTransform, newLocalTransform } from "./newFunction";
import { LocalPosition, WorldPosition } from "./types";
import { alignRotation } from "./alignRotation";

describe("worldToLocal", () => {
  it("position", () => {
    const worldPositions: WorldPosition[] = [
      { x: 0, y: 0 } as WorldPosition,
      { x: 1, y: 0 } as WorldPosition,
      { x: 0, y: 1 } as WorldPosition,
      { x: 0, y: 1 } as WorldPosition,
    ];
    const localPositions: LocalPosition[] = [
      { x: 0, y: 0 } as LocalPosition,
      { x: 1, y: 0 } as LocalPosition,
      { x: -1, y: 1 } as LocalPosition,
      { x: 0, y: 0 } as LocalPosition,
    ];
    expect(worldPosToLocalPos(worldPositions)).toEqual(localPositions);
  });
});
it("align rotation of localPositions", () => {
  const localPositions: LocalPosition[] = [
    { x: 0, y: 10 } as LocalPosition,
    { x: 1, y: 0 } as LocalPosition,
    { x: 0, y: 1 } as LocalPosition,
    { x: 0, y: 1 } as LocalPosition,
  ];
  const rotatedLocalTransforms: LocalTransform[] = [
    newLocalTransform({ x: 10, y: 0 }, Math.PI / 2),
    newLocalTransform({ x: 1, y: 0 }, -Math.PI / 2),
    newLocalTransform({ x: 1, y: 0 }, Math.PI / 2),
    newLocalTransform({ x: 1, y: 0 }, 0),
  ];

  expect(alignRotation(localPositions)).toEqual(rotatedLocalTransforms);
});
it("align rotation of localPositions", () => {
  const localPositions: LocalPosition[] = [
    { x: 0, y: 0 } as LocalPosition,
    { x: 1, y: 0 } as LocalPosition,
    { x: 0, y: 1 } as LocalPosition,
    { x: 1, y: 1 } as LocalPosition,
  ];
  const rotatedLocalTransforms: LocalTransform[] = [
    newLocalTransform({ x: 0, y: 0 }, 0),
    newLocalTransform({ x: 1, y: 0 }, 0),
    newLocalTransform({ x: 1, y: 0 }, Math.PI / 2),
    newLocalTransform({ x: Math.sqrt(2), y: 0 }, -Math.PI / 4),
  ];

  expect(alignRotation(localPositions)).toEqual(rotatedLocalTransforms);
});

describe("localToWorld", () => {
  it("position", () => {
    const localTransforms: LocalTransform[] = [
      newLocalTransform({ x: 0, y: 0 }, 0),
      newLocalTransform({ x: 1, y: 0 }, 0),
      newLocalTransform({ x: 0, y: 1 }, 0),
      newLocalTransform({ x: 0, y: 1 }, 0),
    ];
    const worldTransforms: WorldTransform[] = [
      newWorldTransform({ x: 0, y: 0 }, 0),
      newWorldTransform({ x: 1, y: 0 }, 0),
      newWorldTransform({ x: 1, y: 1 }, 0),
      newWorldTransform({ x: 1, y: 2 }, 0),
    ];
    expect(localToWorld(localTransforms)).toEqual(worldTransforms);
  });
  it("rotation", () => {
    const localTransforms: LocalTransform[] = [
      newLocalTransform({ x: 1, y: 0 }, 0),
      newLocalTransform({ x: 1, y: 0 }, Math.PI / 2),
      newLocalTransform({ x: 1, y: 0 }, 0),
      newLocalTransform({ x: 1, y: 0 }, -Math.PI / 2),
    ];
    const worldTransforms: WorldTransform[] = [
      newWorldTransform({ x: 1, y: 0 }, 0),
      newWorldTransform({ x: 1, y: 1 }, Math.PI / 2),
      newWorldTransform({ x: 1, y: 2 }, Math.PI / 2),
      newWorldTransform({ x: 2, y: 2 }, 0),
    ];
    expect(localToWorld(localTransforms)).toEqual(worldTransforms);
  });
});
