/* @layer renderer-app @kind logic */
import { useSpriteStore } from '../stores/useSpriteStore';
import { useTimelineStore } from '../stores/useTimelineStore';
import type { CurrentPick } from './current-pick.type';

const currentPick = (): CurrentPick => ({
  spriteId: useSpriteStore.getState().activeId,
  frameId: useTimelineStore.getState().frameId,
});

export { currentPick };
