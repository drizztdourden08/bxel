/* @layer renderer-app @kind logic */
import type { ViewMetrics } from './view-metrics.type';

const viewArtBounds = (view: ViewMetrics): { readonly x: number; readonly y: number; readonly right: number; readonly bottom: number } => {
  const halfWidth = view.width / 2 / view.zoom;
  const halfHeight = view.height / 2 / view.zoom;
  return {
    x: Math.max(0, Math.floor(view.pan.x - halfWidth)),
    y: Math.max(0, Math.floor(view.pan.y - halfHeight)),
    right: Math.min(view.imageWidth, Math.ceil(view.pan.x + halfWidth)),
    bottom: Math.min(view.imageHeight, Math.ceil(view.pan.y + halfHeight)),
  };
};

export { viewArtBounds };
