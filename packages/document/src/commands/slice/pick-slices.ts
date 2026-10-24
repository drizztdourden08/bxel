/* @layer core @kind logic */
import type { SpriteId } from '../../model/ids.type';
import type { Artwork } from '../../model/artwork.type';
import { requireSprite } from '../../read/require-sprite';
import type { SliceRef } from '../../schema/command-options.type';
import { nameKey } from '../../validate/name-key';
import { ERROR_CODE } from '../error-code.constants';
import { fail } from '../fail';
import type { PickedSlice } from './slice.type';

const wanted = (ref: SliceRef): ((id: string, name: string) => boolean) =>
  ref.by === 'id' ? (id) => id === ref.id : (_id, name) => nameKey(name) === nameKey(ref.name);

const pickSlices = (artwork: Artwork, sprites: readonly SpriteId[], ref: SliceRef): PickedSlice[] => {
  if (ref.by === 'id' && sprites.length > 1) {
    throw fail(ERROR_CODE.INVALID_OPTION, 'A slice id is valid with one sprite only. Use a slice name.', { path: 'options.slice' });
  }
  const test = wanted(ref);
  const found = sprites.map((id) => {
    const sprite = requireSprite(artwork, id);
    return { sprite, slice: sprite.slices.find((item) => test(item.id, item.name)) };
  });
  const missing = found.filter((item) => !item.slice);
  if (missing.length > 0) {
    const code = sprites.length > 1 ? ERROR_CODE.INCOMPATIBLE_TARGETS : ERROR_CODE.TARGET_NOT_FOUND;
    const details = missing.map((item) => ({ spriteId: item.sprite.id, layerId: null, frameId: null, reason: 'the slice does not exist' }));
    throw fail(code, 'The slice does not exist in every target sprite.', { details, path: 'options.slice' });
  }
  return found.flatMap((item) => (item.slice ? [{ sprite: item.sprite, slice: item.slice }] : []));
};

export { pickSlices };
