/* @layer core @kind logic */
import { FORMAT_ERROR_CODE } from '../failure/format-error.constants';
import { formatFail } from '../failure/format-fail';
import { numberOf } from './number-of';
import { readImage } from './read-image';
import { readTile } from './read-tile';
import type { Rec } from './rec.type';
import { textOf } from './text-of';
import { TILED_LIMITS } from './tiled.constants';
import type { TiledTilesetResult } from './tiled.type';
import { tileRecords } from './tile-records';

const readTilesetRecord = (record: Rec): TiledTilesetResult => {
  const tileWidth = numberOf(record['tilewidth'], 0);
  const tileHeight = numberOf(record['tileheight'], 0);
  if (!Number.isInteger(tileWidth) || !Number.isInteger(tileHeight) || tileWidth < 1 || tileHeight < 1) {
    return formatFail(FORMAT_ERROR_CODE.TILED_INVALID, 'The tileset has no valid tile size.');
  }
  const tileCount = numberOf(record['tilecount'], 0);
  if (tileCount > TILED_LIMITS.MAX_TILES) return formatFail(FORMAT_ERROR_CODE.TILED_UNSUPPORTED, 'The tileset has too many tiles.');
  return {
    ok: true,
    tileset: {
      name: textOf(record['name'], 'tiles'),
      tileWidth,
      tileHeight,
      spacing: numberOf(record['spacing'], 0),
      margin: numberOf(record['margin'], 0),
      columns: numberOf(record['columns'], 0),
      tileCount,
      image: readImage(record),
      tiles: tileRecords(record['tiles']).map(readTile),
    },
  };
};

export { readTilesetRecord };
