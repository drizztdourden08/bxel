/* @layer renderer-app @kind hook */
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { paintPatternGrid } from '../../../canvas-look/paint-pattern-grid';
import { setBit } from '../../../canvas-look/set-bit';
import { useResizeRedraw } from '../../../hooks/useResizeRedraw';
import type { PatternGridArgs, PatternGridModel } from '../SurroundEditor.type';
import { inkOf } from './ink-of';
import { usePatternKeys } from './usePatternKeys';
import { usePatternPointer } from './usePatternPointer';

const usePatternGrid = (args: PatternGridArgs): PatternGridModel => {
  const { bits, look, onChange } = args;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boxRef = useRef<HTMLElement>(null);
  const latest = useRef(bits);
  const [cursor, setCursor] = useState<number | null>(null);
  useLayoutEffect(() => {
    latest.current = bits;
  });
  const paint = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) paintPatternGrid(canvas, { ...look, surroundBits: bits }, cursor, inkOf(canvas));
  }, [look, bits, cursor]);
  useEffect(paint, [paint]);
  useResizeRedraw(boxRef, paint);
  const apply = useCallback(
    (index: number, on: boolean) => {
      if (latest.current.charAt(index) === (on ? '1' : '0')) return;
      latest.current = setBit(latest.current, index, on);
      onChange(latest.current);
    },
    [onChange],
  );
  const pointer = usePatternPointer({ bits: latest, apply, setCursor });
  const keys = usePatternKeys({ bits: latest, cursor, apply, setCursor });
  return { canvasRef, boxRef, ...pointer, ...keys, onFocus: () => setCursor((at) => at ?? 0), onBlur: () => setCursor(null) };
};

export { usePatternGrid };
