/* @layer renderer-app @kind logic */
import { useRulerStore } from '../../../stores/useRulerStore';
import type { PixelView } from '../../PixelViewport';

const publishRuler = (view: PixelView): void => {
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

export { publishRuler };
