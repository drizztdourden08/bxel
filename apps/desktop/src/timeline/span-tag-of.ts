/* @layer renderer-app @kind logic */
import type { AnimSpanTag, AnimTag, Animation } from '@bxel/document';

const spanTagOf = (animation: Animation, tag: AnimTag | undefined): AnimSpanTag | undefined => {
  if (!tag) return undefined;
  if (tag.kind === 'span') return tag;
  const base = animation.tags.find((each) => each.id === tag.of);
  return base?.kind === 'span' ? base : undefined;
};

export { spanTagOf };
