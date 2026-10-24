/* @layer renderer-app @kind component */
import { useTilemapStore } from '../../../stores/useTilemapStore';
import { editTile } from '../../../tilemap/edit-tile';
import { HintedSegments } from '../../HintedSegments';
import { TILE_BAR_TEXT, TILE_MODE_HINTS } from './TileBar.constants';

const TileModeSwitch = () => {
  const editMode = useTilemapStore((state) => state.editMode);
  return (
    <HintedSegments
      label={TILE_BAR_TEXT.mode}
      value={editMode}
      options={[
        { value: 'place', label: TILE_BAR_TEXT.place, hint: TILE_MODE_HINTS.place },
        { value: 'edit', label: TILE_BAR_TEXT.edit, hint: TILE_MODE_HINTS.edit },
      ]}
      onChange={(next) => (next === 'edit' ? editTile() : useTilemapStore.getState().placeTiles())}
    />
  );
};

export { TileModeSwitch };
