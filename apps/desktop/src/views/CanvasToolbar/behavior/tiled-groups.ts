/* @layer renderer-app @kind logic */
import type { MenuGroup, MenuItem } from '@drizztdourden08/tessera';
import { TILE_MODES } from '../../../stores/view-store.constants';
import type { TileMode } from '../../../stores/view-store.type';
import { CANVAS_TEXT, TILED_HINTS } from '../CanvasToolbar.constants';

const tiledGroups = (tiled: TileMode, setTiled: (mode: TileMode) => void): MenuGroup[] => [
  {
    id: 'tiled',
    label: CANVAS_TEXT.tiledOptions,
    items: TILE_MODES.map((mode): MenuItem => ({
      id: mode,
      label: TILED_HINTS[mode].name,
      description: TILED_HINTS[mode].description,
      kind: 'radio',
      checked: tiled === mode,
      onSelect: () => setTiled(mode),
    })),
  },
];

export { tiledGroups };
