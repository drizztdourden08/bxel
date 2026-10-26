/* @layer core @kind logic */
import type { IdSource } from '../../ids/id-source.type';
import type { AnimMirrorTag, Animation } from '../../model/animation.type';
import type { TagId } from '../../model/ids.type';
import { ERROR_CODE } from '../error-code.constants';
import { fail } from '../fail';
import type { MirrorTagOptions } from './anim-tag-options.type';
import { pickAnimTag } from './pick-anim-tag';

const buildMirrorTag = (ids: IdSource, animation: Animation, options: MirrorTagOptions): AnimMirrorTag => {
  const base = pickAnimTag(animation, options.of, 'options.of');
  if (base.kind !== 'span') throw fail(ERROR_CODE.INVALID_OPTION, 'A mirror tag mirrors a span tag.', { path: 'options.of' });
  return { kind: 'mirror', id: ids.next('tag') as TagId, of: base.id, flip: options.flip, facing: options.facing };
};

export { buildMirrorTag };
