/* @layer renderer-app @kind logic */
import { useTilemapStore } from '../stores/useTilemapStore';
import { editTile } from './edit-tile';

const toggleEdit = (): void => {
  const store = useTilemapStore.getState();
  if (store.editMode === 'edit') store.placeTiles();
  else editTile();
};

export { toggleEdit };
