/* @layer renderer-app @kind logic */
import { useViewFeedStore } from '../stores/useViewFeedStore';
import type { PixelView } from '../views/PixelViewport';

const feedOtherView = (view: PixelView | null): void => useViewFeedStore.getState().publishOther(view);

export { feedOtherView };
