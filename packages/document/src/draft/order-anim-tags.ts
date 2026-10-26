/* @layer core @kind logic */
import type { AnimFrame, AnimTag } from '../model/animation.type';

const orderAnimTags = (tags: readonly AnimTag[], frames: readonly AnimFrame[]): readonly AnimTag[] => {
  const position = new Map(frames.map((frame, index) => [frame.id, index] as const));
  const next = tags.map((tag) => {
    if (tag.kind === 'mirror') return tag;
    const from = position.get(tag.from) ?? 0;
    const to = position.get(tag.to) ?? 0;
    return from > to ? { ...tag, from: tag.to, to: tag.from } : tag;
  });
  return next.some((tag, index) => tag !== tags[index]) ? next : tags;
};

export { orderAnimTags };
