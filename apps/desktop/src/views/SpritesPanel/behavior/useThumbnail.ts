/* @layer renderer-app @kind hook */
import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import { findBank } from '@bxel/document';
import type { Artwork, Sprite } from '@bxel/document';
import { bankSpriteImage } from '../../../sheet/bank-sprite-image';
import { drawThumbnail } from './draw-thumbnail';

const useThumbnail = (artwork: Artwork, sprite: Sprite, box: number): RefObject<HTMLCanvasElement | null> => {
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const bank = findBank(artwork, sprite.bankId);
  useEffect(() => {
    const element = canvas.current;
    if (element) {
      element.width = box;
      element.height = box;
    }
  }, [box]);
  useEffect(() => {
    const element = canvas.current;
    if (!element) return undefined;
    const paint = (): void => drawThumbnail(element, bankSpriteImage(bank, sprite), box);
    if (typeof IntersectionObserver === 'undefined') {
      paint();
      return undefined;
    }
    const watch = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) paint();
    });
    watch.observe(element);
    return () => watch.disconnect();
  }, [bank, sprite, box]);
  return canvas;
};

export { useThumbnail };
