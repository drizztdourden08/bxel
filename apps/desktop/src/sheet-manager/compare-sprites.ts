/* @layer renderer-app @kind logic */
import type { Artwork, Sprite } from '@bxel/document';
import { spriteImage } from '../sheet/sprite-image';
import { compareBytes } from './compare-bytes';
import { countDifferent } from './count-different';
import { ALL_ORIENTATIONS } from './identical.constants';
import type { Orientation, SpriteComparison } from './identical.type';
import { spriteBytes } from './sprite-bytes';

const matchingOrientation = (a: Sprite, b: Sprite): Orientation | null => {
  if (a.width !== b.width || a.height !== b.height || a.bankId !== b.bankId || a.frames.length !== b.frames.length) return null;
  const wanted = spriteBytes(a, 'none');
  return ALL_ORIENTATIONS.find((orientation) => compareBytes(wanted, spriteBytes(b, orientation)) === 0) ?? null;
};

const compareSprites = (artwork: Artwork, a: Sprite, b: Sprite): SpriteComparison => {
  const sameSize = a.width === b.width && a.height === b.height;
  const first = spriteImage(artwork, a);
  const second = spriteImage(artwork, b);
  const match = matchingOrientation(a, b);
  return {
    sameSize,
    identical: match === 'none',
    flippedAs: match === 'none' ? null : match,
    differing: sameSize && first && second ? countDifferent(first.rgba, second.rgba) : null,
    total: a.width * a.height,
  };
};

export { compareSprites };
