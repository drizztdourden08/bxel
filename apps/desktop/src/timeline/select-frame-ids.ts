/* @layer renderer-app @kind logic */
import type { AnimFrameId } from '@bxel/document';
import { useTimelineStore } from '../stores/useTimelineStore';

const selectFrameIds = (ids: readonly AnimFrameId[], current?: AnimFrameId): void => {
  const [first] = ids;
  const frameId = current ?? first;
  if (frameId === undefined) return;
  useTimelineStore.getState().select({ frames: ids, anchor: first ?? null }, frameId);
};

export { selectFrameIds };
