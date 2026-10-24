/* @layer core @kind logic */
import { LOAD_ERROR } from '../load-error.constants';
import type { LoadIssue } from '../load-report.type';
import { makeIssue } from '../make-issue';
import type { TilesetFileJson } from './tileset-file.type';

const unusedTileSprites = (file: TilesetFileJson): readonly LoadIssue[] => {
  const used = new Set<string>(file.tileset.tiles.map((tile) => tile.spriteId));
  return file.sprites.flatMap((sprite, index) =>
    used.has(sprite.id)
      ? []
      : [makeIssue(LOAD_ERROR.DOCUMENT_INVALID, `Sprite ${sprite.id} is not the sprite of any tile.`, `$.sprites[${index}]`)],
  );
};

export { unusedTileSprites };
