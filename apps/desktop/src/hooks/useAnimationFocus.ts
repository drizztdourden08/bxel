/* @layer renderer-app @kind hook */
import { useMemo } from 'react';
import { useTimelineStore } from '../stores/useTimelineStore';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import { animationFocus } from '../timeline/animation-focus';
import type { AnimationFocus } from '../timeline/timeline.type';
import { useActiveDocument } from './useActiveDocument';

const useAnimationFocus = (): AnimationFocus | null => {
  const view = useActiveDocument();
  const documentId = view?.state.documentId;
  const tab = useWorkspaceStore((state) => state.tabs.find((each) => each.id === state.activeTab && each.documentId === documentId));
  const frameId = useTimelineStore((state) => state.frameId);
  return useMemo(() => animationFocus(view, tab, frameId), [view, tab, frameId]);
};

export { useAnimationFocus };
