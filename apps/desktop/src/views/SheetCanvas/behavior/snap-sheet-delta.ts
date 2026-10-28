/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/document';
import { guideScope } from '../../../guides/guide-scope';
import { snapDelta } from '../../../sheet/snap-delta';
import type { SheetItem } from '../../../sheet/sheet.type';
import { useSnapGridStore } from '../../../stores/useSnapGridStore';
import { useViewStore } from '../../../stores/useViewStore';
import { SNAP_REACH } from '../SheetCanvas.constants';
import type { SheetDrag } from '../SheetCanvas.type';

const snapSheetDelta = (items: readonly SheetItem[], drag: Extract<SheetDrag, { kind: 'move' }>, delta: Point, invert: boolean, zoom: number): Point => {
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
