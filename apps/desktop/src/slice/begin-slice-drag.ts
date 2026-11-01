/* @layer renderer-app @kind logic */
import { useSliceToolStore } from '../stores/useSliceToolStore';
import { centreEdgeAt } from './centre-edge-at';
import { selectedSlice } from './selected-slice';
import { sliceAt } from './slice-at';
import type { SliceDrag } from './slice-drag.type';
import { sliceHandleAt } from './slice-handle-at';

const beginSliceDrag = (raw: { x: number; y: number }, edge: { x: number; y: number }, zoom: number): SliceDrag | null => {
  const store = useSliceToolStore.getState();
  const current = selectedSlice();
  const handle = current ? sliceHandleAt(current.rect, raw, zoom) : null;
  if (current && handle) return { kind: 'resize', id: current.id, handle, origin: current.rect, rect: current.rect };
  const centreEdge = current && !handle && current.center ? centreEdgeAt(current, raw, zoom) : null;
  if (current && current.center && centreEdge) return { kind: 'centre', id: current.id, edge: centreEdge, rect: current.rect, start: current.center, centre: current.center };
  const hit = sliceAt(raw);
  store.select(hit ? hit.id : null);
  if (hit) return { kind: 'move', id: hit.id, start: edge, origin: hit.rect, rect: hit.rect };
  return { kind: 'new', from: edge, rect: { x: edge.x, y: edge.y, width: 0, height: 0 } };
};

export { beginSliceDrag };
