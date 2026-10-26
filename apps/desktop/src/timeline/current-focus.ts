/* @layer renderer-app @kind logic */
import { useDocumentStore } from '../stores/useDocumentStore';
import { useTimelineStore } from '../stores/useTimelineStore';
import { currentTab } from '../workspace/current-tab';
import { animationFocus } from './animation-focus';
import type { AnimationFocus } from './timeline.type';

const currentFocus = (): AnimationFocus | null => {
  const { host, activeId } = useDocumentStore.getState();
  const view = activeId === null ? null : host.view(activeId);
  return animationFocus(view, currentTab(), useTimelineStore.getState().frameId);
};

export { currentFocus };
