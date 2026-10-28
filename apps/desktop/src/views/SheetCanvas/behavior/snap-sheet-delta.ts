/* @layer renderer-app @kind logic */
import { guideScope } from '../../../guides/guide-scope';
import { snapDelta } from '../../../sheet/snap-delta';
import { useSnapGridStore } from '../../../stores/useSnapGridStore';
import { useViewStore } from '../../../stores/useViewStore';
import { SNAP_REACH } from '../SheetCanvas.constants';
import type { SnapSheetInput } from '../SheetCanvas.type';

const snapSheetDelta = ({ items, drag, delta, invert, zoom }: SnapSheetInput) => {
  if (useViewStore.getState().snap === invert) return delta;
  return snapDelta({
    items,
    ids: drag.ids,
    delta,
    grid: useSnapGridStore.getState().grid,
    lines: guideScope()?.lines(),
    reach: SNAP_REACH / Math.max(zoom, 0.01),
  });
};

export { snapSheetDelta };
