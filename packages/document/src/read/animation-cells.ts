/* @layer core @kind logic */
import type { AnimFlip, AnimSpanTag, Animation } from '../model/animation.type';
import type { TagId } from '../model/ids.type';
import type { AnimCell } from './anim-cell.type';

const range = (animation: Animation, tag: AnimSpanTag, flip: AnimFlip | null): AnimCell[] => {
  const from = animation.frames.findIndex((frame) => frame.id === tag.from);
  const to = animation.frames.findIndex((frame) => frame.id === tag.to);
  if (from < 0 || to < 0) return [];
  return animation.frames.slice(Math.min(from, to), Math.max(from, to) + 1).map((frame) => ({ frameId: frame.id, flip }));
};

const animationCells = (animation: Animation, tagId: TagId | null): readonly AnimCell[] => {
  if (tagId === null) return animation.frames.map((frame) => ({ frameId: frame.id, flip: null }));
  const tag = animation.tags.find((item) => item.id === tagId);
  if (!tag) return [];
  if (tag.kind === 'span') return range(animation, tag, null);
  const base = animation.tags.find((item) => item.id === tag.of);
  return base?.kind === 'span' ? range(animation, base, tag.flip) : [];
};

export { animationCells };
