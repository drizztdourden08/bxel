/* @layer renderer-app @kind logic */
import type { RulerView } from './ruler.type';

const sameRulerView = (a: RulerView, b: RulerView): boolean =>
  a.originX === b.originX &&
  a.originY === b.originY &&
  a.zoom === b.zoom &&
  a.width === b.width &&
  a.height === b.height &&
  a.imageWidth === b.imageWidth &&
  a.imageHeight === b.imageHeight;

export { sameRulerView };
