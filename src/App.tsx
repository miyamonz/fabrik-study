import React, { useEffect, useState } from "react";
import "./App.css";
import { DraggableCircle } from "./DraggableCircle";

type Pos = { x: number; y: number };

const chainLengths = [100, 200, 300, 100];

type Bone = {
  position: Pos;
  rotationLimit?: [number, number];
};

function* generateChain() {
  let x = 100;
  let y = 200;
  yield { position: { x, y } } as Bone;
  for (let i = 0; i < chainLengths.length; i++) {
    x = chainLengths[i];
    yield {
      position: { x, y },
      rotationLimit: [-Math.PI / 3, Math.PI / 3],
    } as Bone;
  }
}
function App() {
  const [chain, setChain] = useState<Bone[]>([...generateChain()]);

  const [start, setStart] = useState<Pos>({ x: 100, y: 300 });
  const [end, setEnd] = useState<Pos>({ x: 500, y: 300 });

  const updateChain = (i: number) => (worldPos: Pos) => {
    const offset = chain.slice(0, i).reduce(
      (acc, bone) => {
        acc.x += bone.position.x;
        acc.y += bone.position.y;
        return acc;
      },
      { x: 0, y: 0 }
    );

    const localPos = {
      x: worldPos.x - offset.x,
      y: worldPos.y - offset.y,
    };

    return setChain(
      chain.map((p, j) => (j === i ? { ...p, position: localPos } : p))
    );
  };

  useEffect(() => {
    const newChain = tickChain(start, end, chain);
    setChain(newChain);
  }, [start, end]);

  return (
    <div className="App">
      <svg width={1000} height={1000}>
        {chain.map((c, i) => {
          const DrawLimitLine = ({
            limit,
            pos,
          }: {
            limit: number;
            pos: Pos;
          }) => (
            <line
              transform={`rotate(${(limit * 180) / Math.PI} ${pos.x} ${pos.y})`}
              x1={pos.x}
              y1={pos.y}
              x2={pos.x + 100}
              y2={pos.y}
              stroke="red"
              strokeWidth={2}
            />
          );

          return (
            <React.Fragment key={i}>
              <DraggableCircle position={c.position} onMove={updateChain(i)} />
              {c.rotationLimit && (
                <g>
                  <DrawLimitLine limit={c.rotationLimit[0]} pos={c.position} />
                  <DrawLimitLine limit={c.rotationLimit[1]} pos={c.position} />
                </g>
              )}
              {i !== chain.length - 1 && (
                <line
                  x1={chain[i].position.x}
                  y1={chain[i].position.y}
                  x2={chain[i + 1].position.x}
                  y2={chain[i + 1].position.y}
                  stroke="black"
                  strokeWidth={2}
                />
              )}
            </React.Fragment>
          );
        })}
        <DraggableCircle position={start} onMove={setStart} fill="red" r={10} />
        <DraggableCircle position={end} onMove={setEnd} fill="green" r={10} />
      </svg>
    </div>
  );
}

function tickChain(start: Pos, end: Pos, chain: Bone[]) {
  let newChain = [...chain];

  //backward
  newChain = [
    ...updateChain(end, newChain.reverse(), [...chainLengths].reverse()),
  ].reverse();
  //forward
  return [...updateChain(start, newChain, chainLengths)];
}

function* updateChain(start: Pos, chain: Bone[], chailnLengths: number[]) {
  let prev: Bone = { ...chain[0], position: start };
  yield prev;
  for (let i = 0; i < chailnLengths.length; i++) {
    const next = chain[i + 1];
    yield (prev = movePoint(prev, next, chailnLengths[i]));
  }
}

function movePoint(bone1: Bone, bone2: Bone, chainLen: number): Bone {
  console.log(bone1, bone2, chainLen);
  const p1 = bone1.position;
  const p2 = bone2.position;

  const v = {
    x: p2.x - p1.x,
    y: p2.y - p1.y,
  };
  const len = Math.hypot(v.x, v.y);
  const nv = {
    x: v.x / len,
    y: v.y / len,
  };
  return {
    position: {
      x: p1.x + nv.x * chainLen,
      y: p1.y + nv.y * chainLen,
    },
    rotationLimit: bone1.rotationLimit,
  };
}

export default App;
