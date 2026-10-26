/* @layer core @kind logic */
import type { Animation } from '../../model/animation.type';
import type { AnimFrameRef } from '../../schema/animation-options.type';
import { ERROR_CODE } from '../error-code.constants';
import { fail } from '../fail';
import type { PickedAnimFrame } from './anim.type';

const pickAnimFrame = (animation: Animation, ref: AnimFrameRef, path: string): PickedAnimFrame => {
  const index = ref.by === 'id' ? animation.frames.findIndex((frame) => frame.id === ref.id) : ref.index;
  const frame = animation.frames[index];
  if (!frame) {
    const what = ref.by === 'id' ? `Frame ${ref.id}` : `Frame at position ${ref.index}`;
    throw fail(ERROR_CODE.TARGET_NOT_FOUND, `${what} does not exist in animation "${animation.name}".`, { path });
  }
  return { frame, index };
};

export { pickAnimFrame };
