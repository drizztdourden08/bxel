/* @layer renderer-app @kind hook */
import { useEffect, useMemo, useRef } from 'react';
import type { RefObject } from 'react';
import { findBank, tilePlayback, tileStepAt } from '@bxel/document';
import { bankRgba } from '../../../export/bank-rgba';
import { subscribeTileClock } from '../../../tile-animation/tile-clock';
import { drawPlaybackFrame } from '../../../tile-animation/draw-playback-frame';
import { tileCanvas } from '../../../tilemap/tile-canvas';
import type { TileThumbProps } from '../TilesetPanel.type';
import { drawShapes } from './draw-shapes';
import { drawThumb } from './draw-thumb';

const useTileThumb = ({ view, cell }: TileThumbProps): RefObject<HTMLCanvasElement | null> => {
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const { artwork, tileset, zoom, mode, animate } = view;
  const { tile, sprite } = cell;
  const playback = useMemo(() => (tile.animation ? tilePlayback(artwork, tileset, tile) : null), [artwork, tileset, tile]);
  useEffect(() => {
    const element = canvas.current;
    if (!element) return undefined;
    const paint = (source: HTMLCanvasElement | null): void => {
      drawThumb(element, source, zoom);
      if (mode === 'collision') drawShapes(element, tileset, tile, zoom);
    };
    paint(tileCanvas(artwork, sprite));
    const bank = findBank(artwork, tileset.bankId);
    if (!playback || !bank || !animate) return undefined;
    const table = bankRgba(bank);
    const scratch = document.createElement('canvas');
    let shown = -1;
    return subscribeTileClock((now) => {
      const at = tileStepAt(playback, now);
      const frame = playback.frames[at];
      if (at === shown || !frame) return;
      shown = at;
      drawPlaybackFrame(scratch, { indices: frame, table, width: tileset.tileWidth, height: tileset.tileHeight });
      paint(scratch);
    });
  }, [artwork, tileset, tile, sprite, zoom, mode, animate, playback]);
  return canvas;
};

export { useTileThumb };
