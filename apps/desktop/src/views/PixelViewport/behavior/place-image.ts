/* @layer renderer-app @kind logic */
import type { PixelView } from '../PixelViewport.type';
import type { PlacedImage } from './viewport.type';

const placeImage = (view: PixelView): PlacedImage => {
  const scale = view.zoom * view.dpr;
  return {
    x: Math.round(view.originX * view.dpr),
    y: Math.round(view.originY * view.dpr),
    scale,
    width: view.imageWidth * scale,
    height: view.imageHeight * scale,
  };
};

export { placeImage };
