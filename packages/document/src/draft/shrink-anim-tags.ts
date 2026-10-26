/* @layer core @kind logic */
import type { AnimFrame, AnimSpanTag, AnimTag } from '../model/animation.type';
import type { AnimFrameId } from '../model/ids.type';
import type { ShrunkAnimTags } from './shrink-anim-tags.type';

const shrinkSpan = (tag: AnimSpanTag, frames: readonly AnimFrame[], gone: ReadonlySet<AnimFrameId>): AnimSpanTag | null => {
  const from = frames.findIndex((frame) => frame.id === tag.from);
  const to = frames.findIndex((frame) => frame.id === tag.to);
  const kept = frames.slice(from, to + 1).filter((frame) => !gone.has(frame.id));
  const first = kept[0];
  const last = kept[kept.length - 1];
  if (!first || !last) return null;
  return first.id === tag.from && last.id === tag.to ? tag : { ...tag, from: first.id, to: last.id };
};

const shrinkAnimTags = (tags: readonly AnimTag[], frames: readonly AnimFrame[], gone: ReadonlySet<AnimFrameId>): ShrunkAnimTags => {
  const spans = new Map(tags.flatMap((tag) => (tag.kind === 'span' ? [[tag.id, shrinkSpan(tag, frames, gone)] as const] : [])));
  const kept = tags.flatMap((tag): AnimTag[] => {
    if (tag.kind === 'span') {
      const next = spans.get(tag.id);
      return next ? [next] : [];
    }
    return spans.get(tag.of) ? [tag] : [];
  });
  const alive = new Set(kept.map((tag) => tag.id));
  return { tags: kept, removed: tags.filter((tag) => !alive.has(tag.id)).map((tag) => tag.id) };
};

export { shrinkAnimTags };
