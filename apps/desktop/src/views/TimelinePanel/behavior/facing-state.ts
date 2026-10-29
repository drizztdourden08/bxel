/* @layer renderer-app @kind logic */
import type { AnimTag } from '@bxel/document';

const facingState = (tag: AnimTag | undefined): 'missing' | 'mirror' | 'tag' => {
  if (tag === undefined) return 'missing';
  return tag.kind === 'mirror' ? 'mirror' : 'tag';
};

export { facingState };
