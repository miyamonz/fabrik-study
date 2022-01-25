import React, { useEffect, useState } from "react";
import "./App.css";
import { DraggableCircle } from "./DraggableCircle";

type Pos = { x: number; y: number };

const chainLengths = [100, 200, 300, 100, 100, 100, 100];

function* generateChain() {
  let x = 100;
  let y = 200;
  yield { x, y };
  for (let i = 0; i < chainLengths.length; i++) {
    x += chainLengths[i];
    yield { x, y };
  }
}
function App() {
  const [chain, setChain] = useState<Pos[]>([...generateChain()]);

  const [start, setStart] = useState<Pos>({ x: 100, y: 300 });
  const [end, setEnd] = useState<Pos>({ x: 500, y: 300 });

  const updateChain = (i: number) => (pos: Pos) => {
    return setChain(chain.map((p, j) => (j === i ? pos : p)));
  };

  useEffect(() => {
    const newChain = tickChain(start, end, chain);
    setChain(newChain);
  }, [start, end]);

  return (
    <div className="App">
      <svg width={1000} height={1000}>
        {chain.map((c, i) => {
          return (
            <>
              <DraggableCircle key={i} position={c} onMove={updateChain(i)} />
              {i !== chain.length - 1 && (
                <line
                  x1={chain[i].x}
                  y1={chain[i].y}
                  x2={chain[i + 1].x}
                  y2={chain[i + 1].y}
                  stroke="black"
                  strokeWidth={2}
                />
              )}
            </>
          );
        })}
        <DraggableCircle position={start} onMove={setStart} fill="red" r={10} />
        <DraggableCircle position={end} onMove={setEnd} fill="green" r={10} />
      </svg>
    </div>
  );
}

function tickChain(start: Pos, end: Pos, chain: Pos[]) {
  const newChain = [...chain];
  console.log(start, end, chain);

  console.log("back");
  newChain[newChain.length - 1] = end;
  for (let i = newChain.length - 2; i >= 0; i--) {
    const p = newChain[i];
    const p2 = newChain[i + 1];
    console.log(p, p2, i, chainLengths[i]);
    const newP = movePoint(p2, p, chainLengths[i]);
    newChain[i] = newP;
  }

  console.log("forward");
  newChain[0] = start;
  for (let i = 0; i < newChain.length - 1; i++) {
    const p = newChain[i];
    const p2 = newChain[i + 1];
    const newP = movePoint(p, p2, chainLengths[i]);
    newChain[i + 1] = newP;
  }

  return newChain;
}

function movePoint(p1: Pos, p2: Pos, chainLen: number) {
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
    x: p1.x + nv.x * chainLen,
    y: p1.y + nv.y * chainLen,
  };
}

export default App;
