import React from 'react';

interface SwipeCardFrameProps {
  children: React.ReactNode;
  index: number;
  isTop: boolean;
  x: number;
  y: number;
  rot: number;
  onPointerDown?: (e: React.PointerEvent) => void;
  elevated?: boolean;
}

export function SwipeCardFrame({
  children,
  index,
  isTop,
  x,
  y,
  rot,
  onPointerDown,
  elevated
}: SwipeCardFrameProps) {
  return (
    <div
      className="absolute left-1/2 top-1/2 w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2 select-none"
      style={{ zIndex: elevated ? 1000 : 100 - index }}
    >
      <div
        className="origin-bottom rounded-3xl"
        style={{ transform: `translate(${x}px, ${y}px) rotate(${rot}deg)` }}
        onPointerDown={isTop ? onPointerDown : undefined}
      >
        {children}
      </div>
    </div>
  );
}