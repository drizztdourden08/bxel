/* @layer renderer-app @kind hook */
import type { ToolbarItem } from '@drizztdourden08/tessera';
import { useTilemapStore } from '../../../stores/useTilemapStore';
import { buttonItem } from '../../../toolbar-items';
import { clearCells } from '../../../tilemap/clear-cells';
import { makeUnique } from '../../../tilemap/make-unique';
import { replaceCells } from '../../../tilemap/replace-cells';
import { useHintKeys } from '../../ActionHint';
import { CLEAR_CELLS_HINT, REPLACE_ALL_HINT, REPLACE_IN_HINT, TILE_OPTIONS_TEXT, UNIQUE_CELLS_HINT } from '../sub-components/TileOptions.constants';

const useMapSelectionItems = (): ToolbarItem[] => {
  const disabled = useTilemapStore((state) => state.selection === null);
  const inKeys = useHintKeys(REPLACE_IN_HINT);
  const allKeys = useHintKeys(REPLACE_ALL_HINT);
  const uniqueKeys = useHintKeys(UNIQUE_CELLS_HINT);
  const clearKeys = useHintKeys(CLEAR_CELLS_HINT);
  return [
    buttonItem({
      id: 'replace-in', icon: 'square', hint: REPLACE_IN_HINT, keys: inKeys, caption: TILE_OPTIONS_TEXT.replaceInCaption, disabled, onSelect: () => replaceCells(false),
    }),
    buttonItem({
      id: 'replace-all', icon: 'layout-grid', hint: REPLACE_ALL_HINT, keys: allKeys, caption: TILE_OPTIONS_TEXT.replaceAllCaption, disabled, onSelect: () => replaceCells(true),
    }),
    buttonItem({ id: 'make-unique', icon: 'copy', hint: UNIQUE_CELLS_HINT, keys: uniqueKeys, caption: TILE_OPTIONS_TEXT.uniqueCaption, disabled, onSelect: makeUnique }),
    buttonItem({ id: 'clear-cells', icon: 'eraser', hint: CLEAR_CELLS_HINT, keys: clearKeys, caption: TILE_OPTIONS_TEXT.clearCaption, disabled, onSelect: clearCells }),
  ];
};

export { useMapSelectionItems };
