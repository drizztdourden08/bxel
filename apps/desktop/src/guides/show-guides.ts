/* @layer renderer-app @kind logic */
import { useViewStore } from '../stores/useViewStore';

const showGuides = (): void => {
  if (!useViewStore.getState().guides) useViewStore.getState().setToggles({ guides: true });
};

export { showGuides };
