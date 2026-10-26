/* @layer core @kind logic */
import type { AnimSpanTag, Animation } from '../../model/animation.type';
import type { AnimationTagUpdateOptions } from '../../schema/animation-options.type';
import { checkName } from '../../validate/check-name';
import { ERROR_CODE } from '../error-code.constants';
import { fail } from '../fail';
import { spanFrames } from './span-frames';

const withoutOptional = (tag: AnimSpanTag): AnimSpanTag => {
  const { id, kind, name, from, to, direction, repeat } = tag;
  return { id, kind, name, from, to, direction, repeat };
};

const optionalOf = (tag: AnimSpanTag, options: AnimationTagUpdateOptions): Pick<AnimSpanTag, 'facing' | 'colour'> => {
  const facing = options.facing === undefined ? tag.facing : (options.facing ?? undefined);
  const colour = options.colour === undefined ? tag.colour : (options.colour ?? undefined);
  return { ...(facing === undefined ? {} : { facing }), ...(colour === undefined ? {} : { colour }) };
};

const patchSpanTag = (animation: Animation, tag: AnimSpanTag, options: AnimationTagUpdateOptions): AnimSpanTag => {
  if (options.flip !== undefined || options.of !== undefined) {
    throw fail(ERROR_CODE.INVALID_OPTION, 'A span tag has no flip or base tag.', { path: 'options.tag' });
  }
  const span =
    options.from === undefined && options.to === undefined
      ? { from: tag.from, to: tag.to }
      : spanFrames(
          animation,
          options.from ?? { by: 'id', id: tag.from },
          options.to ?? { by: 'id', id: tag.to },
        );
  return {
    ...withoutOptional(tag),
    name: options.name === undefined ? tag.name : checkName(options.name),
    ...span,
    direction: options.direction ?? tag.direction,
    repeat: options.repeat ?? tag.repeat,
    ...optionalOf(tag, options),
  };
};

export { patchSpanTag };
