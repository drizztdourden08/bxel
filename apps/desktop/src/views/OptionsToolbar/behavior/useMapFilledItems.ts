/* @layer renderer-app @kind hook */
import type { ToolbarItem } from '@drizztdourden08/tessera';
import { useTilemapStore } from '../../../stores/useTilemapStore';
import { toggleItem } from '../../../toolbar-items';
import { FILLED_MAP_HINT, TILE_OPTIONS_TEXT } from '../sub-components/TileOptions.constants';

const useMapFilledItems = (): ToolbarItem[] => {
  const filled = useTilemapStore((state) => state.filled);
  const setFilled = useTilemapStore((state) => state.setFilled);
  return [
    toggleItem({
      id: 'map-filled', icon: 'pixel-shape-rect-filled', hint: FILLED_MAP_HINT, caption: TILE_OPTIONS_TEXT.filledCaption, pressed: filled, onChange: setFilled,
    }),
  ];
};

export { useMapFilledItems };
