/* @layer renderer-app @kind logic */
import { useRulerStore } from '../stores/useRulerStore';
import { useViewFeedStore } from '../stores/useViewFeedStore';
import type { PixelSource, PixelView } from '../views/PixelViewport';

const feedView = (view: PixelView | null, source: PixelSource | undefined): void => {
  useViewFeedStore.getState().publish(view, source);
  if (!view) return;
  useRulerStore.getState().setView({
    originX: view.originX,
    originY: view.originY,
    zoom: view.zoom,
    width: view.width,
    height: view.height,
    imageWidth: view.imageWidth,
    imageHeight: view.imageHeight,
  });
};

export { feedView };
