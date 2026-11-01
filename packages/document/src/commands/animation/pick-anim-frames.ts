/* @layer core @kind logic */
import type { AnimFrame, Animation } from '../../model/animation.type';
import { pickAnimFrame } from './pick-anim-frame';
import type { FrameChoice } from './pick-anim-frames.type';

const pickAnimFrames = (animation: Animation, choice: FrameChoice): AnimFrame[] => {
  const refs = choice.frames ?? (choice.frame === undefined ? [] : [choice.frame]);
  const path = choice.frames === undefined ? 'options.frame' : 'options.frames';
  const seen = new Set<string>();
  const picked: AnimFrame[] = [];
  for (const [index, ref] of refs.entries()) {
    const { frame } = pickAnimFrame(animation, ref, choice.frames === undefined ? path : `${path}.${index}`);
    if (seen.has(frame.id)) continue;
    seen.add(frame.id);
    picked.push(frame);
  }
  return picked;
};

export { pickAnimFrames };
