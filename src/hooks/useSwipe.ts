import { useRef, useState } from 'react';

export function useSwipe(initial = { x: 0, y: 0 }) {
  const pos = useRef({ x: initial.x, y: initial.y, rot: 0, dragging: false });
  const start = useRef<{ x: number; y: number } | null>(null);
  const [, rerender] = useState(0);

  function onPointerDown(e: React.PointerEvent, onEnd: (dx: number, dy: number) => void) {
    const el = e.currentTarget as HTMLElement;
    start.current = { x: e.clientX, y: e.clientY };

    function move(ev: PointerEvent) {
      if (!start.current) return;
      const dx = ev.clientX - start.current.x;
      const dy = ev.clientY - start.current.y;

      // Threshold so taps aren't treated as drags
      if (!pos.current.dragging && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) {
        pos.current.dragging = true;
        el.setPointerCapture?.(ev.pointerId);
      }
      if (!pos.current.dragging) return;

      pos.current.x = dx;
      pos.current.y = dy;
      pos.current.rot = dx / 20;
      rerender((n) => n + 1);
    }

    function up(ev: PointerEvent) {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);

      const dx = start.current ? ev.clientX - start.current.x : 0;
      const dy = start.current ? ev.clientY - start.current.y : 0;
      const dragged = pos.current.dragging;

      start.current = null;
      pos.current.dragging = false;

      if (dragged) onEnd(dx, dy);

      // Reset transform
      pos.current.x = 0;
      pos.current.y = 0;
      pos.current.rot = 0;
      rerender((n) => n + 1);
    }

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  }

  return {
    get x() { return pos.current.x; },
    get y() { return pos.current.y; },
    get rot() { return pos.current.rot; },
    onPointerDown,
  };
}