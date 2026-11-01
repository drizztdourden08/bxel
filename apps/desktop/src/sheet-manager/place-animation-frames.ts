/* @layer renderer-app @kind logic */
import type { AnimFrame, SpriteId } from '@bxel/document';
import { useNoticeStore } from '../stores/useNoticeStore';
import { addToSheet } from './add-to-sheet';
import { ANIMATION_ENTRY_TEXT } from './animation-entry-text.constants';
import type { AnimationFacts, CurrentManager } from './manager.type';
import { pickedAnimations } from './picked-animations';

const idsOf = (frames: readonly AnimFrame[]): SpriteId[] => frames.flatMap((frame) => (frame.spriteId === null ? [] : [frame.spriteId]));

const spritesOf = (fact: AnimationFacts): SpriteId[] => {
  const tag = fact.animation.tags.find((each) => each.id === fact.tagId);
  const { frames } = fact.animation;
  if (tag?.kind !== 'span') return idsOf(frames);
  const from = frames.findIndex((frame) => frame.id === tag.from);
  const to = frames.findIndex((frame) => frame.id === tag.to);
  return from < 0 || to < from ? [] : idsOf(frames.slice(from, to + 1));
};

const placeAnimationFrames = (manager: Pick<CurrentManager, 'animations' | 'picked' | 'sheet'>): boolean => {
  const facts = pickedAnimations(manager);
  if (facts.length === 0) {
    useNoticeStore.getState().post(ANIMATION_ENTRY_TEXT.needAnimation);
    return false;
  }
  const ids = [...new Set(facts.flatMap(spritesOf))];
  const done = addToSheet(ids, manager.sheet?.id ?? null);
  if (done) useNoticeStore.getState().post(ANIMATION_ENTRY_TEXT.placed(ids.length));
  return done;
};

export { placeAnimationFrames };
