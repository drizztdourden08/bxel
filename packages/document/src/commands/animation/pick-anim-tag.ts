/* @layer core @kind logic */
import type { AnimTag, Animation } from '../../model/animation.type';
import type { AnimTagRef } from '../../schema/animation-options.type';
import { nameKey } from '../../validate/name-key';
import { ERROR_CODE } from '../error-code.constants';
import { fail } from '../fail';

const matches = (tag: AnimTag, ref: AnimTagRef): boolean => {
  if (ref.by === 'id') return tag.id === ref.id;
  if (tag.kind !== 'span' || nameKey(tag.name) !== nameKey(ref.name)) return false;
  return ref.facing === undefined || tag.facing === ref.facing;
};

const pickAnimTag = (animation: Animation, ref: AnimTagRef, path: string): AnimTag => {
  const found = animation.tags.filter((tag) => matches(tag, ref));
  const [tag] = found;
  if (!tag) {
    const what = ref.by === 'id' ? `Tag ${ref.id}` : `Tag "${ref.name}"`;
    throw fail(ERROR_CODE.TARGET_NOT_FOUND, `${what} does not exist in animation "${animation.name}".`, { path });
  }
  if (found.length > 1) throw fail(ERROR_CODE.INVALID_OPTION, 'The tag name needs a facing to pick one tag.', { path });
  return tag;
};

export { pickAnimTag };
