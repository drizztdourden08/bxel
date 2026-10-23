/* @layer renderer-app @kind logic */
import type { PixelView } from '../PixelViewport.type';
import type { ImageSize, ViewBox, ViewTarget } from './viewport.type';
import { originOf } from './origin-of';

const viewOf = (target: ViewTarget, box: ViewBox, image: ImageSize): PixelView => {
  const origin = originOf(target, box);
  return {
    zoom: target.zoom,
    pan: target.pan,
    originX: origin.x,
    originY: origin.y,
    width: box.width,
    height: box.height,
    dpr: box.dpr,
    imageWidth: image.width,
    imageHeight: image.height,
  };
};

export { viewOf };
