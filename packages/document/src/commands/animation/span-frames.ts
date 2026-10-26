/* @layer core @kind logic */
import type { AnimSpanTag, Animation } from '../../model/animation.type';
import type { AnimFrameRef } from '../../schema/animation-options.type';
import { ERROR_CODE } from '../error-code.constants';
import { fail } from '../fail';
import { pickAnimFrame } from './pick-anim-frame';

const spanFrames = (animation: Animation, from: AnimFrameRef, to: AnimFrameRef): Pick<AnimSpanTag, 'from' | 'to'> => {
  const first = pickAnimFrame(animation, from, 'options.from');
  const last = pickAnimFrame(animation, to, 'options.to');
  if (first.index > last.index) {
    throw fail(ERROR_CODE.INVALID_OPTION, 'A tag runs from an earlier frame to a later or equal frame.', { path: 'options.to' });
  }
  return { from: first.frame.id, to: last.frame.id };
};

export { spanFrames };
