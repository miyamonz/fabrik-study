import { movePoint } from "./movePoint";

test("movePoint", () => {
  const p1 = { x: 0, y: 0 };
  const p2 = { x: 2, y: 0 };
  const chainLen = 1;
  const result = movePoint(p1, p2, chainLen);
  expect(result).toEqual({ x: 1, y: 0 });
});
test("movePoint", () => {
  const p1 = { x: 0, y: 0 };
  const p2 = { x: 2, y: 2 };
  const chainLen = Math.sqrt(2);
  const result = movePoint(p1, p2, chainLen);
  expect(result).toEqual({ x: 1, y: 1 });
});
