/* @layer renderer-app @kind hook */
import { useEffect } from 'react';
import type { RefObject } from 'react';
import { findBank } from '@bxel/document';
import type { Artwork, Sprite } from '@bxel/document';
import { cachedThumbnail } from './cached-thumbnail';
import { useThumbCanvas } from './useThumbCanvas';

const useThumbnail = (artwork: Artwork, sprite: Sprite, box: number): RefObject<HTMLCanvasElement | null> => {
  const canvas = useThumbCanvas(box);
  const bank = findBank(artwork, sprite.bankId);
  useEffect(() => {
    const element = canvas.current;
    if (!element) return undefined;
    const paint = (): void => {
      const ctx = element.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(0, 0, box, box);
      ctx.drawImage(cachedThumbnail(element.ownerDocument, bank, sprite, box), 0, 0);
    };
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
