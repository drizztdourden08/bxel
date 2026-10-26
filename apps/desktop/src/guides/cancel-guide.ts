/* @layer renderer-app @kind logic */
import { useGuideStore } from '../stores/useGuideStore';

const cancelGuide = (): void => {
  useGuideStore.getState().setDrag(null);
};

export { cancelGuide };
