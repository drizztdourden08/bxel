/* @layer renderer-app @kind logic */
import type { AnimFacing, AnimTag, Animation } from '@bxel/document';

const facingTag = (animation: Animation, facing: AnimFacing): AnimTag | undefined =>
  animation.tags.find((tag) => tag.facing === facing);

export { facingTag };
