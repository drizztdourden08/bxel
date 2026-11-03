/* @layer renderer-app @kind logic */
import type { NavigatorViewport } from '@drizztdourden08/tessera';
import { useViewStore } from '../../../stores/useViewStore';
import { panOfViewport } from './pan-of-viewport';

const moveView = (next: NavigatorViewport): void => {
  useViewStore.getState().viewport?.panTo(panOfViewport(next));
};

export { moveView };
