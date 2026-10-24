/* @layer core @kind logic */
import type { SpriteId } from '../../model/ids.type';
import type { Artwork } from '../../model/artwork.type';
import type { Tag } from '../../model/sprite.type';
import { requireSprite } from '../../read/require-sprite';
import type { TagRef } from '../../schema/command-options.type';
import { nameKey } from '../../validate/name-key';
import type { TargetIssue } from '../command-error.type';
import { ERROR_CODE } from '../error-code.constants';
import { fail } from '../fail';
import type { PickedTag } from './tag.type';

const matches = (tag: Tag, ref: TagRef): boolean =>
  ref.by === 'id' ? tag.id === ref.id : nameKey(tag.name) === nameKey(ref.name);

const describe = (ref: TagRef): string => (ref.by === 'id' ? `Tag ${ref.id}` : `Tag "${ref.name}"`);

const pickTags = (artwork: Artwork, sprites: readonly SpriteId[], ref: TagRef): PickedTag[] => {
  if (ref.by === 'id' && sprites.length > 1) {
    throw fail(ERROR_CODE.INVALID_OPTION, 'A tag id is valid with one sprite only. Use a tag name.', { path: 'options.tag' });
  }
  const picked: PickedTag[] = [];
  const missing: TargetIssue[] = [];
  for (const spriteId of sprites) {
    const sprite = requireSprite(artwork, spriteId);
    const tag = sprite.tags.find((item) => matches(item, ref));
    if (tag) picked.push({ sprite, tag });
    else missing.push({ spriteId, layerId: null, frameId: null, reason: 'the tag does not exist' });
  }
  if (missing.length > 0) {
    const code = sprites.length > 1 ? ERROR_CODE.INCOMPATIBLE_TARGETS : ERROR_CODE.TARGET_NOT_FOUND;
    throw fail(code, `${describe(ref)} does not exist in every target sprite.`, { details: missing, path: 'options.tag' });
  }
  return picked;
};

export { pickTags };
