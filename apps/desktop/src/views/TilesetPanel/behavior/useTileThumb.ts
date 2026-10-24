/* @layer renderer-app @kind hook */
import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import type { Artwork, Sprite } from '@bxel/document';
import { tileCanvas } from '../../../tilemap/tile-canvas';
import { drawTile } from './draw-tile';

const useTileThumb = (artwork: Artwork, sprite: Sprite): RefObject<HTMLCanvasElement | null> => {
  const canvas = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    if (canvas.current) drawTile(canvas.current, tileCanvas(artwork, sprite));
  }, [artwork, sprite]);
  return canvas;
};

export { useTileThumb };
