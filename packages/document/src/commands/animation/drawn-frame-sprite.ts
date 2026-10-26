/* @layer core @kind logic */
import { ensureCel } from '../../draft/ensure-cel';
import type { Draft } from '../../draft/draft.type';
import { writableCel } from '../../draft/writable-cel';
import type { Animation } from '../../model/animation.type';
import type { Sprite } from '../../model/sprite.type';
import { requireSprite } from '../../read/require-sprite';
import { ownedBlank } from './owned-blank';

const drawnFrameSprite = (draft: Draft, animation: Animation, pixels: Uint8Array): Sprite => {
  const blank = ownedBlank(draft, animation.name, animation, animation.bankId);
  if (!pixels.some((value) => value !== 0)) return blank;
  const layer = blank.layers[0];
  const frame = blank.frames[0];
  if (layer && frame) {
    const celId = ensureCel(draft, { spriteId: blank.id, layerId: layer.id, frameId: frame.id, celId: null });
    writableCel(draft, blank.id, celId).set(pixels);
  }
  return requireSprite(draft.artwork, blank.id);
};

export { drawnFrameSprite };
