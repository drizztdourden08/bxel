/* @layer core @kind logic */
import { ERROR_CODE } from '../commands/error-code.constants';
import type { CommandFailure } from '../commands/command-failure';
import { fail } from '../commands/fail';
import type { Draft } from '../draft/draft.type';
import type { Artwork } from '../model/artwork.type';
import type { Sprite } from '../model/sprite.type';
import type { Tile, Tileset } from '../model/tilemap.type';
import { findSprite } from '../read/find-sprite';
import { collisionIssue } from '../read/collision-issue';
import { findTileset } from '../read/find-tileset';
import { orientationIssue } from '../read/orientation-issue';
import { terrainIssue } from '../read/terrain-issue';
import { terrainSetsIssue } from '../read/terrain-sets-issue';
import { tileAnimationIssue } from '../read/tile-animation-issue';
import { tileShapes } from '../read/tile-shapes';
import { cellKey } from '../tilemap/cell-key';

const broken = (message: string): CommandFailure => fail(ERROR_CODE.REFERENCE_BROKEN, message);

const fits = (sprite: Sprite, tileset: Tileset): boolean =>
  sprite.role === 'tile' &&
  sprite.width === tileset.tileWidth &&
  sprite.height === tileset.tileHeight &&
  sprite.bankId === tileset.bankId;

const tileIssue = (artwork: Artwork, tileset: Tileset, tile: Tile): string | null => {
  const size = { width: tileset.tileWidth, height: tileset.tileHeight };
  const shape = tileShapes(tile).map((each) => collisionIssue(each, size)).find((issue) => issue !== null) ?? null;
  return shape ?? tileAnimationIssue(artwork, tileset, tile);
};

const checkTile = (artwork: Artwork, tileset: Tileset, tile: Tile, keys: ReadonlySet<number>): void => {
  const sprite = findSprite(artwork, tile.spriteId);
  if (!sprite || !fits(sprite, tileset)) {
    throw broken(`Tile ${tile.key} of tileset "${tileset.name}" needs a tile sprite of the tileset size and bank.`);
  }
  if (keys.has(tile.key) || tile.key >= tileset.nextKey) {
    throw broken(`Tile key ${tile.key} of tileset "${tileset.name}" is not unique or not issued.`);
  }
  const issue = tileIssue(artwork, tileset, tile);
  if (issue !== null) throw broken(`Tile ${tile.key} of tileset "${tileset.name}": ${issue}`);
};

const checkTerrain = (tileset: Tileset): void => {
  const rules = tileset.terrain ? terrainIssue(tileset.terrain, tileset) : null;
  if (rules !== null) throw broken(rules);
  const sets = tileset.terrainSets ? terrainSetsIssue(tileset.terrainSets, tileset) : null;
  if (sets !== null) throw broken(sets);
};

const checkTileset = (artwork: Artwork, tileset: Tileset): void => {
  const keys = new Set<number>();
  for (const tile of tileset.tiles) {
    checkTile(artwork, tileset, tile, keys);
    keys.add(tile.key);
  }
  checkTerrain(tileset);
};

const checkMaps = (draft: Draft): void => {
  const { artwork, base } = draft;
  for (const tilemap of artwork.tilemaps) {
    const tileset = findTileset(artwork, tilemap.tilesetId);
    if (!tileset) throw broken(`Tilemap "${tilemap.name}" names a tileset that does not exist.`);
    const shape = tilemap.orientation ? orientationIssue(tilemap.orientation, tileset) : null;
    if (shape !== null) throw broken(`Tilemap "${tilemap.name}": ${shape}`);
    const prior = base.tilemaps.find((item) => item.id === tilemap.id);
    const known = new Set(tileset.tiles.map((tile) => tile.key));
    const fresh = tilemap.layers.filter((layer) => !prior?.layers.some((old) => old.cells === layer.cells));
    const scanned = base.tilesets === artwork.tilesets ? fresh : tilemap.layers;
    for (const layer of scanned) {
      const size = tilemap.columns * tilemap.rows;
      const hole = layer.cells.length !== size || layer.cells.some((cell) => cellKey(cell) !== 0 && !known.has(cellKey(cell)));
      if (hole) throw broken(`Layer "${layer.name}" of tilemap "${tilemap.name}" holds a cell with no tile.`);
    }
  }
};

const checkTiles = (draft: Draft): void => {
  const { artwork, base } = draft;
  if (artwork.tilesets.length === 0 && artwork.tilemaps.length === 0) return;
  if (artwork.sprites !== base.sprites || artwork.tilesets !== base.tilesets || artwork.animations !== base.animations) {
    for (const tileset of artwork.tilesets) checkTileset(artwork, tileset);
  }
  if (artwork.tilemaps !== base.tilemaps || artwork.tilesets !== base.tilesets) checkMaps(draft);
};

export { checkTiles };
