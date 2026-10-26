/* @layer core @kind logic */
import type { Draft } from '../../draft/draft.type';
import type { AnimFrame, AnimTag, Animation } from '../../model/animation.type';
import type { AnimFrameId, SpriteId, TagId } from '../../model/ids.type';
import { findSprite } from '../../read/find-sprite';
import { ownedCopy } from './owned-copy';

const copiedFrames = (draft: Draft, source: Animation, owner: string, ids: Map<AnimFrameId, AnimFrameId>): AnimFrame[] => {
  const sprites = new Map<SpriteId, SpriteId>();
  return source.frames.map((frame) => {
    const id = draft.ids.next('afr') as AnimFrameId;
    ids.set(frame.id, id);
    const original = frame.spriteId === null ? undefined : findSprite(draft.artwork, frame.spriteId);
    if (original?.role !== 'frame') return { ...frame, id };
    const copy = sprites.get(original.id) ?? ownedCopy(draft, owner, original).id;
    sprites.set(original.id, copy);
    return { ...frame, id, spriteId: copy };
  });
};

const copiedTags = (draft: Draft, tags: readonly AnimTag[], frames: ReadonlyMap<AnimFrameId, AnimFrameId>): AnimTag[] => {
  const ids = new Map(tags.map((tag) => [tag.id, draft.ids.next('tag') as TagId] as const));
  return tags.map((tag) => {
    const id = ids.get(tag.id) ?? tag.id;
    if (tag.kind === 'mirror') return { ...tag, id, of: ids.get(tag.of) ?? tag.of };
    return { ...tag, id, from: frames.get(tag.from) ?? tag.from, to: frames.get(tag.to) ?? tag.to };
  });
};

const copyAnimationContent = (draft: Draft, source: Animation, owner: string): Pick<Animation, 'frames' | 'tags'> => {
  const ids = new Map<AnimFrameId, AnimFrameId>();
  const frames = copiedFrames(draft, source, owner, ids);
  return { frames, tags: copiedTags(draft, source.tags, ids) };
};

export { copyAnimationContent };
