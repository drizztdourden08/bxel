/* @layer renderer-app @kind logic */
import { MAPPING_EPSILON } from '../PixelViewport.constants';
import type { PixelPoint } from '../PixelViewport.type';
import type { ViewBox, ViewTarget } from './viewport.type';
import { originOf } from './origin-of';

const screenToPixel = (local: PixelPoint, target: ViewTarget, box: ViewBox): PixelPoint => {
  const origin = originOf(target, box);
  const across = box.mirror ? box.width - local.x : local.x;
  return {
    x: Math.floor((across - origin.x) / target.zoom + MAPPING_EPSILON),
    y: Math.floor((local.y - origin.y) / target.zoom + MAPPING_EPSILON),
  };
};

export { screenToPixel };
