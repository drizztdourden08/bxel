/* @layer renderer-app @kind logic */
import { findBank, findSprite } from '@bxel/document';
import type { Animation, Artwork } from '@bxel/document';
import { toDataUrl } from '../export/to-data-url';
import { animationPreview } from '../files/animation-preview';
import type { AnimationThumb } from './animation-thumb.type';

const cache = new WeakMap<Animation, AnimationThumb>();

const animationThumb = (artwork: Artwork, animation: Animation): string | null => {
  const bank = findBank(artwork, animation.bankId);
  const first = animation.frames[0]?.spriteId;
  const sprite = first === null || first === undefined ? undefined : findSprite(artwork, first);
  const known = cache.get(animation);
  if (known && known.bank === bank && known.sprite === sprite) return known.url;
  const bytes = animationPreview(artwork, animation);
  const url = bytes === null ? null : toDataUrl(bytes, 'image/png');
  cache.set(animation, { bank, sprite, url });
  return url;
};

export { animationThumb };
