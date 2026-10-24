/* @layer renderer-app @kind hook */
import type { ToolbarItem } from '@drizztdourden08/tessera';
import { TILEMAP_COMMAND } from '../../../keymap/tilemap-command-id.constants';
import { useSpriteStore } from '../../../stores/useSpriteStore';
import { useTilemapStore } from '../../../stores/useTilemapStore';
import { editTile } from '../../../tilemap/edit-tile';
import { choose, hintChoice } from '../../../toolbar-items';
import { useCommandKeys } from '../../ActionHint';
import { TILE_MODE_HINTS, TILE_MODE_ICONS, TILE_MODE_ORDER, TILE_OPTIONS_TEXT } from '../sub-components/TileOptions.constants';

const useTileModeItems = (): ToolbarItem[] => {
  const tilemap = useSpriteStore((state) => state.mode === 'tilemap');
  const editMode = useTilemapStore((state) => state.editMode);
  const placeKeys = useCommandKeys(TILEMAP_COMMAND.placeTiles)[0];
  const editKeys = useCommandKeys(TILEMAP_COMMAND.editTile)[0];
  if (!tilemap) return [];
  const keys = { place: placeKeys, edit: editKeys };
  return [
    {
      kind: 'group',
      id: 'tile-mode',
      label: TILE_OPTIONS_TEXT.mode,
      description: TILE_OPTIONS_TEXT.modeDescription,
      value: editMode,
      choices: TILE_MODE_ORDER.map((each) => hintChoice(each, TILE_MODE_ICONS[each], TILE_MODE_HINTS[each], keys[each])),
      onChange: choose(TILE_MODE_ORDER, (next) => (next === 'edit' ? editTile() : useTilemapStore.getState().placeTiles())),
    },
  ];
};

export { useTileModeItems };
