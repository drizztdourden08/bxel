/* @layer renderer-app @kind hook */
import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import type { RefObject } from 'react';
import type { FrameCache, FrameInput } from './viewport.type';
import { paintFrame } from './paint-frame';
import { windowOf } from './window-of';

const useFrame = (rootRef: RefObject<HTMLElement | null>, canvasRef: RefObject<HTMLCanvasElement | null>, frame: FrameInput): (() => void) => {
  const input = useRef(frame);
  const pending = useRef<number | null>(null);
  const cache = useRef<FrameCache>({ tile: null, tileKey: '', scratch: null });

  const schedule = useCallback(() => {
    const root = rootRef.current;
    if (!root || pending.current !== null) return;
    pending.current = windowOf(root).requestAnimationFrame(() => {
      pending.current = null;
      const canvas = canvasRef.current;
      if (canvas && rootRef.current) paintFrame(canvas, input.current, cache.current);
    });
  }, [rootRef, canvasRef]);

  const { target, box, image, draw, pivotGrips, source, gridFrom, grids, look, tiled } = frame;
  useLayoutEffect(() => {
    input.current = { target, box, image, draw, pivotGrips, source, gridFrom, grids, look, tiled };
    schedule();
  }, [target, box, image, draw, pivotGrips, source, gridFrom, grids, look, tiled, schedule]);

  useEffect(() => {
    const view = windowOf(rootRef.current);
    return () => {
      if (pending.current !== null) view.cancelAnimationFrame(pending.current);
      pending.current = null;
    };
  }, [rootRef]);

  return schedule;
};

export { useFrame };
