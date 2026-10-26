/* @layer renderer-app @kind logic */
import type { RulerSpan, RulerView } from '../../../ruler/ruler.type';
import type { SymmetryAxis } from '../../../stores/tool-store.type';

const rulerSpan = (axis: SymmetryAxis, view: RulerView): RulerSpan =>
  axis === 'x'
    ? { origin: view.originX, zoom: view.zoom, length: view.width, count: view.imageWidth }
    : { origin: view.originY, zoom: view.zoom, length: view.height, count: view.imageHeight };

export { rulerSpan };
