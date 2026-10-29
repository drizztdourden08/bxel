/* @layer renderer-app @kind logic */
import type { AnimFrameId, TagId } from '@bxel/document';
import { useTimelineStore } from '../stores/useTimelineStore';
import { openAnimation } from './open-animation';

const openAnimationAt = (animationId: string, frameId: AnimFrameId | null, tagId: TagId | null = null): void => {
  openAnimation(animationId);
  const store = useTimelineStore.getState();
  if (frameId !== null) store.setFrame(frameId);
  if (tagId !== null) store.selectTag(tagId);
};

export { openAnimationAt };
