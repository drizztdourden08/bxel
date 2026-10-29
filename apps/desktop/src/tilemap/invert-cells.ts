/* @layer renderer-app @kind logic */
import { useTilemapStore } from '../stores/useTilemapStore';
import { currentMap } from './current-map';
import { selectionMaskOf } from './selection-mask-of';
import { selectionOfMask } from './selection-of-mask';
import { commitMapSelection } from './commit-map-selection';

const invertCells = (): boolean => {
  const target = currentMap();
  if (!target) return false;
  const store = useTilemapStore.getState();
  const current = selectionMaskOf(store.selection, target.tilemap);
  commitMapSelection(selectionOfMask(current.map((bit) => 1 - bit), target));
  return true;
};

export { invertCells };
