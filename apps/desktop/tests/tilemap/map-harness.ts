/* @layer renderer-app @kind test */
import { COMMAND_NAME, flattenTilemap } from '@bxel/document';
import type { Artwork, MapLayer, Tilemap, Tileset } from '@bxel/document';
import { currentArtwork } from '../../src/sheet/current-artwork';
import { runDocument } from '../../src/sheet/run-document';
import { spritesTarget } from '../../src/sheet/sprites-target';
import { MAP_DEFAULTS } from '../../src/views/TilemapDialog/TilemapDialog.constants';
import { TILEMAP_DEFAULTS } from '../../src/stores/tilemap-store.constants';
import { useDocumentStore } from '../../src/stores/useDocumentStore';
import { useTilemapStore } from '../../src/stores/useTilemapStore';
import { focusTab } from '../../src/workspace/focus-tab';
import { tabOf } from '../../src/workspace/tab-of';
import { addTile } from '../../src/tilemap/add-tile';
import { createTilemap } from '../../src/tilemap/create-tilemap';
import { createTileset } from '../../src/tilemap/create-tileset';
import { openFile } from '../sheet/sheet-harness';

const ROCK = [2, 3, 4, 5];

const artworkNow = (): Artwork => {
  const found = currentArtwork();
  if (!found) throw new Error('no document');
  return found;
};

const tilesetNow = (): Tileset => {
  const found = artworkNow().tilesets[0];
  if (!found) throw new Error('no tileset');
  return found;
};

const mapNow = (): Tilemap => {
  const found = artworkNow().tilemaps[0];
  if (!found) throw new Error('no tilemap');
  return found;
};

const layerNow = (at = 0): MapLayer => {
  const found = mapNow().layers[at];
  if (!found) throw new Error('no map layer');
  return found;
};

const cellsNow = (at = 0): number[] => Array.from(layerNow(at).cells);

const tileSprite = (key: number) => {
  const tile = tilesetNow().tiles.find((each) => each.key === key);
  const sprite = artworkNow().sprites.find((each) => each.id === tile?.spriteId);
  if (!sprite) throw new Error(`no tile ${key}`);
  return sprite;
};

const tilePixels = (key: number): number[] => {
  const cel = Object.values(tileSprite(key).cels)[0];
  return cel ? Array.from(cel.pixels) : [];
};

const paintTile = (key: number, pixels: readonly number[]): void => {
  const sprite = tileSprite(key);
  const rect = { x: 0, y: 0, width: sprite.width, height: sprite.height };
  const done = runDocument('Paint tile', [
    { name: COMMAND_NAME.pixelsPatch, targets: spritesTarget([sprite.id]), options: { rect, pixels: Uint8Array.from(pixels) } },
  ]);
  if (!done) throw new Error('could not paint the tile');
};

const picture = (): number[][] => {
  const flat = flattenTilemap(artworkNow(), mapNow().id);
  const rows: number[][] = [];
  for (let y = 0; y < flat.height; y += 1) rows.push(Array.from(flat.pixels.subarray(y * flat.width, (y + 1) * flat.width)));
  return rows;
};

const openMapFile = (): void => {
  openFile([], 4);
  useTilemapStore.setState({ ...TILEMAP_DEFAULTS });
  if (createTileset({ name: 'ground', width: 2, height: 2 }) !== null) throw new Error('no tileset');
  addTile();
  addTile();
  paintTile(1, [1, 1, 1, 1]);
  paintTile(2, ROCK);
  const tilesetId = tilesetNow().id;
  if (createTilemap({ name: 'level', tilesetId, ...MAP_DEFAULTS, columns: 4, rows: 3 }) !== null) throw new Error('no tilemap');
  useTilemapStore.getState().setStamp({ columns: 1, rows: 1, keys: [2] });
  const { activeId } = useDocumentStore.getState();
  if (activeId === null) throw new Error('no document');
  focusTab(tabOf(activeId, { kind: 'tilemap', id: mapNow().id }));
};

export { ROCK, artworkNow, cellsNow, layerNow, mapNow, openMapFile, paintTile, picture, tilePixels, tileSprite, tilesetNow };
