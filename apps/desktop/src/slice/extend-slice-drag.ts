/* @layer renderer-app @kind logic */
import type { Size } from '@bxel/document';
import { moveCentreEdge } from './move-centre-edge';
import { resizeSliceRect } from './resize-slice-rect';
import { shiftSliceRect } from './shift-slice-rect';
import type { SliceDrag } from './slice-drag.type';
import { spanSliceRect } from './span-slice-rect';

const extendSliceDrag = (drag: SliceDrag, edge: { x: number; y: number }, bounds: Size): SliceDrag => {
  if (drag.kind === 'new') return { ...drag, rect: spanSliceRect(drag.from, edge, bounds) };
  if (drag.kind === 'centre') return { ...drag, centre: moveCentreEdge(drag.start, drag.edge, edge, drag.rect) };
  if (drag.kind === 'resize') return { ...drag, rect: resizeSliceRect(drag.origin, drag.handle, edge, bounds) };
  return { ...drag, rect: shiftSliceRect(drag.origin, { x: edge.x - drag.start.x, y: edge.y - drag.start.y }, bounds) };
};

export { extendSliceDrag };
