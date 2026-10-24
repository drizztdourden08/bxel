/* @layer core @kind logic */
import type { Frame, Tag } from '../model/sprite.type';

const orderTags = (tags: readonly Tag[], frames: readonly Frame[]): readonly Tag[] => {
  const position = new Map(frames.map((frame, index) => [frame.id, index] as const));
  const next = tags.map((tag) => {
    const from = position.get(tag.from) ?? 0;
    const to = position.get(tag.to) ?? 0;
    return from > to ? { ...tag, from: tag.to, to: tag.from } : tag;
  });
  return next.some((tag, index) => tag !== tags[index]) ? next : tags;
};

export { orderTags };
