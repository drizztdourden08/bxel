/* @layer renderer-app @kind logic */
import { useViewFeedStore } from '../stores/useViewFeedStore';

const feedSize = (): { width: number; height: number } | null => {
  const { view } = useViewFeedStore.getState();
  return view ? { width: view.imageWidth, height: view.imageHeight } : null;
};

export { feedSize };
