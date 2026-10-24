/* @layer core @kind logic */
import { ERROR_CODE } from '../commands/error-code.constants';
import type { CommandFailure } from '../commands/command-failure';
import { fail } from '../commands/fail';
import type { Draft } from '../draft/draft.type';
import type { Artwork } from '../model/artwork.type';
import type { Sprite } from '../model/sprite.type';
import type { Tileset } from '../model/tilemap.type';
import { findSprite } from '../read/find-sprite';
import { collisionIssue } from '../read/collision-issue';
import { findTileset } from '../read/find-tileset';
import { orientationIssue } from '../read/orientation-issue';
import { terrainIssue } from '../read/terrain-issue';
import { cellKey } from '../tilemap/cell-key';

const broken = (message: string): CommandFailure => fail(ERROR_CODE.REFERENCE_BROKEN, message);

const fits = (sprite: Sprite, tileset: Tileset): boolean =>
  sprite.role === 'tile' &&
  sprite.width === tileset.tileWidth &&
  sprite.height === tileset.tileHeight &&
  sprite.bankId === tileset.bankId;

const checkTileset = (artwork: Artwork, tileset: Tileset): void => {
  const keys = new Set<number>();
  for (const tile of tileset.tiles) {
    const sprite = findSprite(artwork, tile.spriteId);
    if (!sprite || !fits(sprite, tileset)) {
      throw broken(`Tile ${tile.key} of tileset "${tileset.name}" needs a tile sprite of the tileset size and bank.`);
    }
    if (keys.has(tile.key) || tile.key >= tileset.nextKey) {
      throw broken(`Tile key ${tile.key} of tileset "${tileset.name}" is not unique or not issued.`);
    }
    const issue = tile.collision ? collisionIssue(tile.collision, { width: tileset.tileWidth, height: tileset.tileHeight }) : null;
    if (issue !== null) throw broken(`Tile ${tile.key} of tileset "${tileset.name}": ${issue}`);
    keys.add(tile.key);
  }
  const rules = tileset.terrain ? terrainIssue(tileset.terrain, tileset) : null;
  if (rules !== null) throw broken(rules);
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
  if (artwork.sprites !== base.sprites || artwork.tilesets !== base.tilesets) {
    for (const tileset of artwork.tilesets) checkTileset(artwork, tileset);
  }
  if (artwork.tilemaps !== base.tilemaps || artwork.tilesets !== base.tilesets) checkMaps(draft);
};

export { checkTiles };
