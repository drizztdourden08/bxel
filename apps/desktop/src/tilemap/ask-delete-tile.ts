/* @layer renderer-app @kind logic */
import { tileUseCounts } from '@bxel/document';
import { currentArtwork } from '../sheet/current-artwork';
import { useTilemapDialogStore } from '../stores/useTilemapDialogStore';
import { currentTileset } from './current-tileset';
import { deleteTile } from './delete-tile';

const askDeleteTile = (key: number): void => {
  const artwork = currentArtwork();
  const tileset = currentTileset();
  if (!artwork || !tileset) return;
  const uses = tileUseCounts(artwork, tileset.id).get(key) ?? 0;
  if (uses === 0) deleteTile(key, undefined);
  else useTilemapDialogStore.getState().show('delete', key);
};

export { askDeleteTile };
