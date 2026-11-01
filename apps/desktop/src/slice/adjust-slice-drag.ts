/* @layer renderer-app @kind logic */
import type { Slice } from '@bxel/document';
import { centreEdgeAt } from './centre-edge-at';
import type { SliceDrag } from './slice-drag.type';
import { sliceHandleAt } from './slice-handle-at';

const adjustSliceDrag = (current: Slice, raw: { x: number; y: number }, zoom: number): SliceDrag | null => {
  const handle = sliceHandleAt(current.rect, raw, zoom);
  if (handle) return { kind: 'resize', id: current.id, handle, origin: current.rect, rect: current.rect };
  const centreEdge = centreEdgeAt(current, raw, zoom);
  if (current.center && centreEdge) return { kind: 'centre', id: current.id, edge: centreEdge, rect: current.rect, start: current.center, centre: current.center };
  return null;
};

export { adjustSliceDrag };
