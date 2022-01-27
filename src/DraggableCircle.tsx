import React, { useState } from "react";
type Pos = {
  x: number;
  y: number;
};
export const DraggableCircle = ({
  position,
  onMove,
  ...prop
}: {
  position: Pos;
  onMove: (pos: Pos) => void;
} & JSX.IntrinsicElements["circle"]) => {
  const [offset, setOffset] = React.useState({
    x: 0,
    y: 0,
  });
  const [active, setActive] = useState(false);

  const handlePointerDown = (e: React.PointerEvent<SVGCircleElement>) => {
    const el = e.currentTarget;
    const bbox = el.getBoundingClientRect();
    const x = e.clientX - bbox.left;
    const y = e.clientY - bbox.top;
    el.setPointerCapture(e.pointerId);
    setActive(true);
    setOffset({
      x,
      y,
    });
  };
  const handlePointerMove = (e: React.PointerEvent<SVGCircleElement>) => {
    const bbox = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - bbox.left;
    const y = e.clientY - bbox.top;
    if (active) {
      onMove({
        x: position.x - (offset.x - x),
        y: position.y - (offset.y - y),
      });
    }
  };
  const handlePointerUp = () => {
    setActive(false);
  };

  return (
    <circle
      cx={position.x}
      cy={position.y}
      r={20}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
      fill={active ? "blue" : "black"}
      {...prop}
    />
  );
};
