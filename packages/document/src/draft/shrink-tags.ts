/* @layer core @kind logic */
import type { FrameId } from '../model/ids.type';
import type { Frame, Tag } from '../model/sprite.type';
import type { ShrunkTags } from './shrink-tags.type';

const shrinkTag = (tag: Tag, order: readonly FrameId[], frameId: FrameId): Tag | null => {
  if (tag.from !== frameId && tag.to !== frameId) return tag;
  if (tag.from === tag.to) return null;
  if (tag.from === frameId) return { ...tag, from: order[order.indexOf(frameId) + 1] ?? tag.to };
  return { ...tag, to: order[order.indexOf(frameId) - 1] ?? tag.from };
};

const shrinkTags = (tags: readonly Tag[], frames: readonly Frame[], frameId: FrameId): ShrunkTags => {
  const order = frames.map((frame) => frame.id);
  const next = tags.map((tag) => shrinkTag(tag, order, frameId));
  return {
    tags: next.filter((tag): tag is Tag => tag !== null),
    removed: tags.filter((_, index) => next[index] === null),
  };
};

export { shrinkTags };
