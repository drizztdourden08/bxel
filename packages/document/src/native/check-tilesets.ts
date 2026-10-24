/* @layer core @kind logic */
import type { Tile, Tileset } from '../model/tilemap.type';
import { collisionIssue } from '../read/collision-issue';
import { terrainIssue } from '../read/terrain-issue';
import type { DocumentJson } from './document-json.type';
import { LOAD_ERROR } from './load-error.constants';
import type { LoadIssue } from './load-report.type';
import { makeIssue } from './make-issue';

const invalid = (message: string, path: string): LoadIssue => makeIssue(LOAD_ERROR.DOCUMENT_INVALID, message, path);

const shapeIssues = (tile: Tile, tileset: Tileset, path: string): readonly LoadIssue[] => {
  const issue = tile.collision ? collisionIssue(tile.collision, { width: tileset.tileWidth, height: tileset.tileHeight }) : null;
  return issue === null ? [] : [invalid(issue, `${path}.collision`)];
};

const terrainIssues = (tileset: Tileset, base: string): readonly LoadIssue[] => {
  const issue = tileset.terrain ? terrainIssue(tileset.terrain, tileset) : null;
  return issue === null ? [] : [invalid(issue, `${base}.terrain`)];
};

const tileIssues = (document: DocumentJson, tileset: Tileset, base: string): readonly LoadIssue[] => {
  const keys = new Set<number>();
  const sprites = new Set<string>();
  return tileset.tiles.flatMap((tile, index) => {
    const path = `${base}.tiles[${index}]`;
    const sprite = document.sprites.find((item) => item.id === tile.spriteId);
    const fit = sprite?.width === tileset.tileWidth && sprite.height === tileset.tileHeight;
    const issues: LoadIssue[] = [...shapeIssues(tile, tileset, path)];
    if (sprite && (sprite.role !== 'tile' || !fit || sprite.bankId !== tileset.bankId)) {
      issues.push(invalid('A tile sprite has role tile and the size and bank of its tileset.', `${path}.spriteId`));
    }
    if (keys.has(tile.key) || tile.key >= tileset.nextKey) {
      issues.push(invalid(`Tile key ${tile.key} repeats or is not below nextKey.`, `${path}.key`));
    }
    if (sprites.has(tile.spriteId)) issues.push(invalid(`Sprite ${tile.spriteId} is used by two tiles.`, `${path}.spriteId`));
    keys.add(tile.key);
    sprites.add(tile.spriteId);
    return issues;
  });
};

const checkTilesets = (document: DocumentJson): readonly LoadIssue[] =>
  document.tilesets.flatMap((tileset, index) => [
    ...tileIssues(document, tileset, `$.tilesets[${index}]`),
    ...terrainIssues(tileset, `$.tilesets[${index}]`),
  ]);

export { checkTilesets };
