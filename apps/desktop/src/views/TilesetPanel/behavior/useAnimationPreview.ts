/* @layer renderer-app @kind hook */
import { useEffect, useMemo, useRef } from 'react';
import type { RefObject } from 'react';
import { findBank, tilePlayback, tileStepAt } from '@bxel/document';
import type { Artwork, Tile, Tileset } from '@bxel/document';
import { bankRgba } from '../../../export/bank-rgba';
import { useTilemapStore } from '../../../stores/useTilemapStore';
import { drawPlaybackFrame } from '../../../tile-animation/draw-playback-frame';
import { subscribeTileClock } from '../../../tile-animation/tile-clock';

const useAnimationPreview = (artwork: Artwork, tileset: Tileset, tile: Tile): RefObject<HTMLCanvasElement | null> => {
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const animate = useTilemapStore((state) => state.animateTiles);
  const playback = useMemo(() => tilePlayback(artwork, tileset, tile), [artwork, tileset, tile]);
  const bank = findBank(artwork, tileset.bankId);
  useEffect(() => {
    const element = canvas.current;
    if (!element || !playback || !bank) return undefined;
    const table = bankRgba(bank);
    let shown = -1;
    const show = (at: number): void => {
      const frame = playback.frames[at];
      if (at === shown || !frame) return;
      shown = at;
      drawPlaybackFrame(element, frame, table, tileset.tileWidth, tileset.tileHeight);
    };
    show(0);
    if (!animate) return undefined;
    return subscribeTileClock((now) => show(tileStepAt(playback, now)));
  }, [playback, bank, animate, tileset.tileWidth, tileset.tileHeight]);
  return canvas;
};

export { useAnimationPreview };
