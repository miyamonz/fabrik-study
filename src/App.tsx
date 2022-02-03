import React, { useEffect, useState } from "react";
import "./App.css";
import { DraggableCircle } from "./DraggableCircle";
import { alignRotation, localToWorld, worldPosToLocalPos } from "./Transform";
import type { Position, WorldPosition, WorldTransform } from "./Transform";

import { tickChain } from "./tickChain";

export const chainLengths = [100, 100, 100, 80, 80, 200, 100];
type RotationLimits = Record<number, [min: number, max: number]>;
const rotationLimits: RotationLimits = {
  2: [-Math.PI / 4, Math.PI / 4],
  3: [-Math.PI / 3, Math.PI / 3],
};
function getChainArray(): Position[] {
  function* generateChain() {
    let x = 100;
    let y = 400;
    yield { x, y };
    for (let i = 0; i < chainLengths.length; i++) {
      x = chainLengths[i];
      yield { x, y };
    }
  }
  return [...generateChain()];
}

function App() {
  const [posArr, setPosArr] = useState<Position[]>(() => getChainArray());
  const [result, setResult] = useState<WorldPosition[]>([]);

  const [start, setStart] = useState({ x: 100, y: 300 } as WorldPosition);
  const [end, setEnd] = useState({ x: 500, y: 300 } as WorldPosition);

  const updatePos = (i: number) => (pos: Position) => {
    return setPosArr(posArr.map((p, j) => (j === i ? pos : p)));
  };

  const [resultTransforms, setResultTransforms] = useState<WorldTransform[]>(
    []
  );

  useEffect(() => {
    const resultPositions = tickChain(
      start,
      end,
      posArr as WorldPosition[],
      rotationLimits
    );
    setResult(resultPositions);
    setPosArr(resultPositions);
    const worldPositions = worldPosToLocalPos(resultPositions);
    //この結果のlocalPos.xをchain lengthで更新しても良い
    const localTransforms = alignRotation(worldPositions);
    const worldTransforms = localToWorld(localTransforms);
    setResultTransforms(worldTransforms);
  }, [start, end]);

  return (
    <div className="App">
      <svg width={1000} height={1000}>
        {posArr.map((p, i) => {
          const next = posArr[i + 1];
          return (
            <React.Fragment key={i}>
              <DraggableCircle position={p} onMove={updatePos(i)} />
              {i !== posArr.length - 1 && (
                <Line p1={p} p2={next} stroke="black" />
              )}
            </React.Fragment>
          );
        })}
        {resultTransforms.map((t, i, arr) => {
          const next = arr[i + 1];
          const limit = rotationLimits[i];
          return (
            <React.Fragment key={i}>
              <Circle p={t.worldPos} />
              <AxisX p={t.worldPos} rot={t.worldRot} />
              <AxisY p={t.worldPos} rot={t.worldRot} />
              {limit && (
                <g
                  transform={`rotate(${(t.worldRot * 180) / Math.PI} ${
                    t.worldPos.x
                  } ${t.worldPos.y})`}
                >
                  <DrawLine pos={t.worldPos} rot={limit[0]} />
                  <DrawLine pos={t.worldPos} rot={limit[1]} />
                </g>
              )}
              {i !== arr.length - 1 && (
                <Line p1={t.worldPos} p2={next.worldPos} stroke="gray" />
              )}
            </React.Fragment>
          );
        })}
        <g>
          {result.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={5}
              fill="blue"
              strokeWidth={2}
            />
          ))}
        </g>
        <DraggableCircle
          position={start}
          onMove={(pos) => setStart(pos as WorldPosition)}
          fill="red"
          r={10}
        />
        <DraggableCircle
          position={end}
          onMove={(pos) => setEnd(pos as WorldPosition)}
          fill="green"
          r={10}
        />
      </svg>
    </div>
  );
}

const Circle = ({ p }: { p: Position }) => (
  <circle cx={p.x} cy={p.y} r={10} fill="gray" />
);

const Line: React.FC<
  { p1: Position; p2: Position } & JSX.IntrinsicElements["line"]
> = ({ p1, p2, ...props }) => (
  <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} strokeWidth="2" {...props} />
);

const AxisX = ({ p, rot }: { p: Position; rot: number }) => (
  <Line
    transform={`rotate(${(rot * 180) / Math.PI} ${p.x} ${p.y})`}
    p1={p}
    p2={{ x: p.x + 20, y: p.y }}
    stroke="red"
  />
);
const AxisY = ({ p, rot }: { p: Position; rot: number }) => (
  <Line
    transform={`rotate(${(rot * 180) / Math.PI} ${p.x} ${p.y})`}
    p1={p}
    p2={{ x: p.x, y: p.y + 20 }}
    stroke="green"
  />
);
const DrawLine = ({ pos, rot }: { pos: Position; rot: number }) => (
  <Line
    transform={`rotate(${(rot * 180) / Math.PI} ${pos.x} ${pos.y})`}
    p1={pos}
    p2={{ x: pos.x + 40, y: pos.y }}
    stroke="gray"
    strokeWidth={5}
  />
);
export default App;
