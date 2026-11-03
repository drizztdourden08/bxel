/* @layer renderer-app @kind logic */
import type { NavigatorViewport } from '@drizztdourden08/tessera';
import { useViewFeedStore } from '../../../stores/useViewFeedStore';
import { useViewStore } from '../../../stores/useViewStore';
import { panOfViewport } from './pan-of-viewport';

const moveView = (next: NavigatorViewport): void => {
  const { view } = useViewFeedStore.getState();
  const { viewport } = useViewStore.getState();
  if (view) viewport?.panTo(panOfViewport(view, next));
};

export { moveView };
