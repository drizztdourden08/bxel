/* @layer renderer-app @kind hook */
import { useCallback, useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import { useResizeRedraw } from './useResizeRedraw';

const usePaintedCanvas = (draw: (canvas: HTMLCanvasElement) => void): RefObject<HTMLCanvasElement | null> => {
  const ref = useRef<HTMLCanvasElement>(null);
  const paint = useCallback(() => {
    if (ref.current) draw(ref.current);
  }, [draw]);
  useEffect(paint, [paint]);
  useResizeRedraw(ref, paint);
  return ref;
};

export { usePaintedCanvas };
