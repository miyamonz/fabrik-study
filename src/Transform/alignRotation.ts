import { LocalTransform } from "./Transform";
import { newLocalTransform } from "./newFunction";
import { LocalPosition } from "./types";

export function alignRotation(
  localPositions: LocalPosition[]
): LocalTransform[] {
  function* gen(): IterableIterator<LocalTransform> {
    let lastRot = 0;
    for (const curr of localPositions) {
      const len = Math.hypot(curr.x, curr.y);
      const pos = {
        x: len,
        y: 0,
      };
      const rot = Math.atan2(curr.y, curr.x);
      yield newLocalTransform(pos, rot - lastRot);
      lastRot = rot;
    }
  }
  return [...gen()];
}
