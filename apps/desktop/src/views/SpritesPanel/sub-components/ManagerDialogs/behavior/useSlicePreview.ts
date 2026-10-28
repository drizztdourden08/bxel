/* @layer renderer-app @kind hook */
import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import type { Artwork, Rect, Sprite } from '@bxel/document';
import { bankSpriteImage } from '../../../../../sheet/bank-sprite-image';
import { findBank } from '@bxel/document';
import { frameCanvas } from '../../../../EntryTile/behavior/frame-canvas';
import { drawSliceOutlines } from './draw-slice-outlines';
import { PREVIEW_BOX } from './useSlicePreview.constants';

const useSlicePreview = (artwork: Artwork, sprite: Sprite | undefined, rects: readonly Rect[]): RefObject<HTMLCanvasElement | null> => {
  const canvas = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const element = canvas.current;
    const ctx = element?.getContext('2d');
    if (!element || !ctx || !sprite) return;
    const scale = Math.max(1, Math.floor(PREVIEW_BOX / Math.max(sprite.width, sprite.height)));
    element.width = sprite.width * scale;
    element.height = sprite.height * scale;
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, element.width, element.height);
    const image = bankSpriteImage(findBank(artwork, sprite.bankId), sprite);
    if (image) ctx.drawImage(frameCanvas(element.ownerDocument, image), 0, 0, element.width, element.height);
    drawSliceOutlines(ctx, rects, scale);
  }, [artwork, sprite, rects]);
  return canvas;
};

export { useSlicePreview };
