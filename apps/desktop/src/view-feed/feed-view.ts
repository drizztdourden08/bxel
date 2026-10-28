/* @layer renderer-app @kind logic */
import { useViewFeedStore } from '../stores/useViewFeedStore';
import type { PixelSource, PixelView } from '../views/PixelViewport';

const feedView = (view: PixelView | null, source: PixelSource | undefined): void => useViewFeedStore.getState().publish(view, source);

export { feedView };
