/* @layer renderer-app @kind logic */
import type { AnimSpanTag, AnimTag, Animation, TagId } from '@bxel/document';

const spanTagOf = (animation: Animation, tag: AnimTag | undefined): AnimSpanTag | undefined => {
  if (!tag) return undefined;
  if (tag.kind === 'span') return tag;
  const base = animation.tags.find((each) => each.id === tag.of);
  return base?.kind === 'span' ? base : undefined;
};

const tagById = (animation: Animation, tagId: TagId | null): AnimTag | undefined => animation.tags.find((tag) => tag.id === tagId);

export { spanTagOf, tagById };
