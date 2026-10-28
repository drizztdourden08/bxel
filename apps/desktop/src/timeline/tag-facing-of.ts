/* @layer renderer-app @kind logic */
import type { AnimFacing, AnimTag, Animation } from '@bxel/document';
import { spanTagOf } from './span-tag-of';

const tagFacingOf = (animation: Animation, tag: AnimTag | undefined): AnimFacing | undefined => {
  if (tag === undefined) return undefined;
  if (tag.kind === 'mirror') return tag.facing;
  return spanTagOf(animation, tag)?.facing;
};

export { tagFacingOf };
