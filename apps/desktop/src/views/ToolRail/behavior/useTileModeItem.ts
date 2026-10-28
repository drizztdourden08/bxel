/* @layer renderer-app @kind hook */
import type { ToolbarItem } from '@drizztdourden08/tessera';
import { useKeysOf } from '../../../hooks/useKeysOf';
import { TILEMAP_COMMAND } from '../../../keymap/tilemap-command-id.constants';
import { useSpriteStore } from '../../../stores/useSpriteStore';
import { useTilemapStore } from '../../../stores/useTilemapStore';
import { TILE_MODE_HINTS, TILE_MODE_ICONS, TILE_TEXT } from '../../../tilemap/tile-mode.constants';
import { editTile } from '../../../tilemap/edit-tile';
import { buttonItem } from '../../../toolbar-items';

const useTileModeItem = (): ToolbarItem[] => {
  const tilemap = useSpriteStore((state) => state.mode === 'tilemap');
  const editMode = useTilemapStore((state) => state.editMode);
  const keys = useKeysOf()(TILEMAP_COMMAND.toggleEdit);
  if (!tilemap) return [];
  const hint = TILE_MODE_HINTS[editMode];
  const other = editMode === 'place' ? TILE_TEXT.edit : TILE_TEXT.place;
  return [
    buttonItem({
      id: 'tile-mode',
      icon: TILE_MODE_ICONS[editMode],
      hint: { name: `${TILE_TEXT.mode}: ${hint.name}`, description: `${hint.description} ${TILE_TEXT.switchTo(other)}.` },
      keys,
      onSelect: () => (editMode === 'place' ? editTile() : useTilemapStore.getState().placeTiles()),
    }),
    { kind: 'separator', id: 'after-tile-mode' },
  ];
};

export { useTileModeItem };
