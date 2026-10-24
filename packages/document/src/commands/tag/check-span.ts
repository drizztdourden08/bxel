/* @layer core @kind logic */
import type { FrameId } from '../../model/ids.type';
import type { Sprite } from '../../model/sprite.type';
import { ERROR_CODE } from '../error-code.constants';
import { fail } from '../fail';

const checkSpan = (sprite: Sprite, from: FrameId, to: FrameId): void => {
  const first = sprite.frames.findIndex((frame) => frame.id === from);
  const last = sprite.frames.findIndex((frame) => frame.id === to);
  if (first > last) {
    throw fail(ERROR_CODE.INVALID_OPTION, 'A tag runs from an earlier frame to a later or equal frame.', {
      path: 'options.to',
      details: [{ spriteId: sprite.id, layerId: null, frameId: to, reason: 'it comes before the first frame of the tag' }],
    });
  }
};

export { checkSpan };
