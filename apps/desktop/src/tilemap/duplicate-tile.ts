/* @layer renderer-app @kind logic */
import { COMMAND_NAME, findSprite, findTile, flattenFrame } from '@bxel/document';
import { currentArtwork } from '../sheet/current-artwork';
import { runDocument } from '../sheet/run-document';
import { currentTileset } from './current-tileset';
import { pickTile } from './pick-tile';
import { TILE_LABEL, TILE_REF } from './tilemap.constants';

const duplicateTile = (key: number): boolean => {
  const artwork = currentArtwork();
  const tileset = currentTileset();
  const tile = tileset ? findTile(tileset, key) : undefined;
  const sprite = artwork && tile ? findSprite(artwork, tile.spriteId) : undefined;
  const frame = sprite?.frames[0];
  if (!tileset || !sprite || !frame) return false;
  const add = { name: COMMAND_NAME.tileAdd, targets: null, options: { tileset: tileset.id }, ref: TILE_REF.tile };
  const rect = { x: 0, y: 0, width: sprite.width, height: sprite.height };
  const copy = {
    name: COMMAND_NAME.pixelsPatch,
    targets: { sprites: [{ ref: TILE_REF.tile }], layers: { by: 'all' as const }, frames: { by: 'all' as const } },
    options: { rect, pixels: flattenFrame(sprite, frame.id), skipZero: false },
  };
  const done = runDocument(TILE_LABEL.duplicateTile, [add, copy]);
  const made = currentTileset()?.tiles.find((each) => each.spriteId === done?.created[TILE_REF.tile]);
  return made !== undefined && pickTile(made.key);
};

export { duplicateTile };
