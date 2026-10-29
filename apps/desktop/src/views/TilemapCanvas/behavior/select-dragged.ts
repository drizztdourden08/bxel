/* @layer renderer-app @kind logic */
import { useTilemapStore } from '../../../stores/useTilemapStore';
import { readCell } from '../../../tilemap/read-cell';
import { selectCells } from '../../../tilemap/select-cells';
import type { MapTarget } from '../../../tilemap/tilemap.type';
import type { MapDrag } from '../TilemapCanvas.type';
import { cellInSelection } from './cell-in-selection';
import { spanRect } from './span-rect';

const selectDragged = (drag: Extract<MapDrag, { kind: 'select' }>, target: MapTarget): void => {
  selectCells({ by: 'rect', rect: spanRect(drag.from, drag.to) }, drag.mode);
  const store = useTilemapStore.getState();
  const { selection } = store;
  if (selection && cellInSelection(drag.from, selection)) {
    store.setSelection({ ...selection, from: readCell(target.tilemap, target.layer, drag.from)?.key ?? 0 });
  }
};

export { selectDragged };
