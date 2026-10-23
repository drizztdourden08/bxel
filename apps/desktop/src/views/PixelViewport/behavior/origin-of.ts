/* @layer renderer-app @kind logic */
import type { PixelPoint } from '../PixelViewport.type';
import type { ViewBox, ViewTarget } from './viewport.type';

const snap = (value: number, dpr: number): number => Math.round(value * dpr) / dpr;

const originOf = (target: ViewTarget, box: ViewBox): PixelPoint => ({
  x: snap(box.width / 2 - target.pan.x * target.zoom, box.dpr),
  y: snap(box.height / 2 - target.pan.y * target.zoom, box.dpr),
});

export { originOf };
