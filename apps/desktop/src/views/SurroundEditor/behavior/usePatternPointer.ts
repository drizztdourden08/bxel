/* @layer renderer-app @kind hook */
import { useRef } from 'react';
import type { PointerEvent } from 'react';
import { cellAt } from '../../../canvas-look/cell-at';
import { isBitSet } from '../../../canvas-look/is-bit-set';
import type { PatternPointer, PatternPointerArgs } from './pattern-grid.type';

const cellOf = (event: PointerEvent<HTMLElement>): number | null => {
  const box = event.currentTarget.getBoundingClientRect();
  return cellAt(event.clientX - box.left, event.clientY - box.top, box.width);
};

const usePatternPointer = ({ bits, apply, setCursor }: PatternPointerArgs): PatternPointer => {
  const painting = useRef<boolean | null>(null);
  return {
    onPointerDown: (event) => {
      const cell = cellOf(event);
      if (cell === null) return;
      event.currentTarget.setPointerCapture(event.pointerId);
      painting.current = !isBitSet(bits.current, cell);
      setCursor(cell);
      apply(cell, painting.current);
    },
    onPointerMove: (event) => {
      if (painting.current === null) return;
      const cell = cellOf(event);
      if (cell !== null) apply(cell, painting.current);
    },
    onPointerUp: () => {
      painting.current = null;
    },
  };
};

export { usePatternPointer };
