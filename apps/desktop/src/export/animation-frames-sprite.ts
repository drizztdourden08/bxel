/* @layer renderer-app @kind logic */
import { findBank } from '@bxel/document';
import type { Animation, Artwork } from '@bxel/document';
import type { ExportSprite } from '@bxel/formats';
import { animationFrameOf } from './animation-frame-of';
import { bankRgba } from './bank-rgba';
import { EXPORT_TEXT } from './export.constants';

const animationFramesSprite = (artwork: Artwork, animation: Animation): ExportSprite | string => {
  const bank = findBank(artwork, animation.bankId);
  if (!bank) return EXPORT_TEXT.noAnimationPalette(animation.name);
  const world = { artwork, animation };
  return {
    name: animation.name,
    width: animation.width,
    height: animation.height,
    pivot: animation.anchor,
    palette: bankRgba(bank),
    frames: animation.frames.flatMap((_frame, index) => animationFrameOf(world, index, null)),
    tags: [],
    slices: [],
  };
};

export { animationFramesSprite };
