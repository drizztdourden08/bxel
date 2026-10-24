/* @layer renderer-app @kind hook */
import type { ToolbarItem } from '@drizztdourden08/tessera';
import { useTilemapStore } from '../../../stores/useTilemapStore';
import { toggleItem } from '../../../toolbar-items';
import { turnCells } from '../../../tilemap/turn-cells';
import { useHintKeys } from '../../ActionHint';
import { FLAG_ACTIONS, FLAG_HINTS } from '../sub-components/TileOptions.constants';

const useMapFlagItems = (): ToolbarItem[] => {
  const flags = useTilemapStore((state) => state.flags);
  const keys = { flipX: useHintKeys(FLAG_HINTS.flipX), flipY: useHintKeys(FLAG_HINTS.flipY), turn: useHintKeys(FLAG_HINTS.turn) };
  return FLAG_ACTIONS.map((action) =>
    toggleItem({ id: `flag-${action.op}`, icon: action.icon, hint: action.hint, keys: keys[action.op], pressed: flags[action.flag], onChange: () => turnCells(action.op) }),
  );
};

export { useMapFlagItems };
