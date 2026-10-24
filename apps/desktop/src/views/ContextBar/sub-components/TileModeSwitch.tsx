/* @layer renderer-app @kind component */
import { SegmentedControl } from '@drizztdourden08/tessera';
import { TILEMAP_COMMAND } from '../../../keymap/tilemap-command-id.constants';
import type { TileEditMode } from '../../../stores/tilemap-store.type';
import { useTilemapStore } from '../../../stores/useTilemapStore';
import { editTile } from '../../../tilemap/edit-tile';
import { segmentOption, useCommandKeys } from '../../ActionHint';
import { TILE_BAR_TEXT, TILE_MODE_HINTS } from './TileBar.constants';

const TileModeSwitch = () => {
  const editMode = useTilemapStore((state) => state.editMode);
  const placeKeys = useCommandKeys(TILEMAP_COMMAND.placeTiles)[0];
  const editKeys = useCommandKeys(TILEMAP_COMMAND.editTile)[0];
  return (
    <SegmentedControl<TileEditMode>
      size="sm"
      aria-label={TILE_BAR_TEXT.mode}
      value={editMode}
      options={[
        segmentOption({ value: 'place', label: TILE_BAR_TEXT.place, hint: TILE_MODE_HINTS.place }, placeKeys),
        segmentOption({ value: 'edit', label: TILE_BAR_TEXT.edit, hint: TILE_MODE_HINTS.edit }, editKeys),
      ]}
      onChange={(next) => (next === 'edit' ? editTile() : useTilemapStore.getState().placeTiles())}
    />
  );
};

export { TileModeSwitch };
