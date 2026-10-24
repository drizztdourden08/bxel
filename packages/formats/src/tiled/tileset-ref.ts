/* @layer core @kind logic */
import { numberOf } from './number-of';
import { readTilesetRecord } from './read-tileset-record';
import type { Rec } from './rec.type';
import type { TiledTilesetRef } from './tiled.type';

const tilesetRef = (record: Rec): TiledTilesetRef => {
  const source = record['source'];
  const firstGid = Math.max(1, Math.floor(numberOf(record['firstgid'], 1)));
  if (typeof source === 'string' && source !== '') return { firstGid, source, embedded: null };
  const read = readTilesetRecord(record);
  return { firstGid, source: null, embedded: read.ok ? read.tileset : null };
};

export { tilesetRef };
