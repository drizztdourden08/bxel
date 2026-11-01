/* @layer renderer-app @kind logic */
import { useSliceToolStore } from '../stores/useSliceToolStore';
import { adjustSliceDrag } from './adjust-slice-drag';
import { selectedSlice } from './selected-slice';
import { sliceAt } from './slice-at';
import type { SliceDrag } from './slice-drag.type';

const beginSliceDrag = (raw: { x: number; y: number }, edge: { x: number; y: number }, zoom: number): SliceDrag | null => {
  const store = useSliceToolStore.getState();
  const current = selectedSlice();
  const adjusting = current ? adjustSliceDrag(current, raw, zoom) : null;
  if (adjusting) return adjusting;
  const hit = sliceAt(raw);
  store.select(hit ? hit.id : null);
  if (hit) return { kind: 'move', id: hit.id, start: edge, origin: hit.rect, rect: hit.rect };
  return { kind: 'new', from: edge, rect: { x: edge.x, y: edge.y, width: 0, height: 0 } };
};

export { beginSliceDrag };
