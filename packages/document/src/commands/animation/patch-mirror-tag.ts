/* @layer core @kind logic */
import type { AnimMirrorTag, Animation } from '../../model/animation.type';
import type { AnimationTagUpdateOptions } from '../../schema/animation-options.type';
import { ERROR_CODE } from '../error-code.constants';
import { fail } from '../fail';
import { SPAN_FIELDS } from './patch-mirror-tag.constants';
import { pickAnimTag } from './pick-anim-tag';

const baseOf = (animation: Animation, options: AnimationTagUpdateOptions, current: AnimMirrorTag): AnimMirrorTag['of'] => {
  if (options.of === undefined) return current.of;
  const base = pickAnimTag(animation, options.of, 'options.of');
  if (base.kind !== 'span') throw fail(ERROR_CODE.INVALID_OPTION, 'A mirror tag mirrors a span tag.', { path: 'options.of' });
  return base.id;
};

const patchMirrorTag = (animation: Animation, tag: AnimMirrorTag, options: AnimationTagUpdateOptions): AnimMirrorTag => {
  if (SPAN_FIELDS.some((field) => options[field] !== undefined) || options.facing === null) {
    throw fail(ERROR_CODE.INVALID_OPTION, 'A mirror tag has a base tag, flip and facing only.', { path: 'options.tag' });
  }
  return { ...tag, of: baseOf(animation, options, tag), flip: options.flip ?? tag.flip, facing: options.facing ?? tag.facing };
};

export { patchMirrorTag };
