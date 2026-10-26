/* @layer renderer-app @kind logic */
import { animationSequence } from '@bxel/document';
import type { AnimSequence, Animation, TagId } from '@bxel/document';
import { tagById } from './tag-by-id';

const playSteps = (animation: Animation, tagId: TagId | null): AnimSequence => {
  const known = tagId !== null && tagById(animation, tagId) !== undefined;
  return animationSequence(animation, known ? tagId : null);
};

export { playSteps };
