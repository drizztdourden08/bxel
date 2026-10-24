/* @layer core @kind logic */
import { addCel } from '../../draft/add-cel';
import type { Draft } from '../../draft/draft.type';
import { writableCel } from '../../draft/writable-cel';
import type { CelId } from '../../model/ids.type';
import { overlayPixels } from '../../pixels/overlay-pixels';
import { requireSprite } from '../../read/require-sprite';
import { isSharedCel } from './is-shared-cel';
import type { CelMerge } from './layer.type';

const mergeCel = (draft: Draft, merge: CelMerge): CelId | null => {
  const { spriteId, sourceLayer, from, into } = merge;
  if (from === into) return into;
  const sprite = requireSprite(draft.artwork, spriteId);
  const source = sprite.cels[from];
  if (!source) return into ?? null;
  const target = into === undefined ? undefined : sprite.cels[into];
  if (into === undefined || !target) return addCel(draft, spriteId, source.pixels.slice());
  if (isSharedCel(sprite, into, sourceLayer)) {
    const merged = target.pixels.slice();
    overlayPixels(merged, source.pixels);
    return addCel(draft, spriteId, merged);
  }
  overlayPixels(writableCel(draft, spriteId, into), source.pixels);
  return into;
};

export { mergeCel };
