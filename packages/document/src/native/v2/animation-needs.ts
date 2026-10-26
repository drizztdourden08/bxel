/* @layer core @kind logic */
import type { Animation } from '../../model/animation.type';

const animationNeeds = (animation: Animation, owned: ReadonlySet<string>): readonly string[] => [
  ...new Set(
    animation.frames.flatMap((frame) => (frame.spriteId !== null && !owned.has(frame.spriteId) ? [frame.spriteId] : [])),
  ),
];

export { animationNeeds };
