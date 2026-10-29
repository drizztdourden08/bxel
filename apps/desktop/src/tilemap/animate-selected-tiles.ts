/* @layer renderer-app @kind logic */
import { currentArtwork } from '../sheet/current-artwork';
import { useTilemapStore } from '../stores/useTilemapStore';
import { animationFromTiles } from '../tile-animation/animation-from-tiles';
import { currentTileset } from './current-tileset';

const animateSelectedTiles = (): boolean => {
  const artwork = currentArtwork();
  const tileset = currentTileset();
  const keys = useTilemapStore.getState().stamp.keys.filter((key) => key !== 0);
  return artwork !== null && tileset !== null && animationFromTiles(artwork, tileset, keys);
};

export { animateSelectedTiles };
