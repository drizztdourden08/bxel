/* @layer renderer-app @kind hook */
import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import type { AtlasDraw } from '../AtlasView.type';
import { drawAtlas } from './draw-atlas';

const useAtlasCanvas = (view: AtlasDraw): RefObject<HTMLCanvasElement | null> => {
  const canvas = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    if (canvas.current) drawAtlas(canvas.current, view);
  }, [view]);
  return canvas;
};

export { useAtlasCanvas };
