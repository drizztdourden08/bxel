/* @layer core @kind logic */
import { fromXmlTileset } from './from-xml-tileset';
import { parseTiledText } from './parse-tiled-text';
import { readTilesetRecord } from './read-tileset-record';
import type { TiledTilesetResult } from './tiled.type';

const readTiledTileset = (text: string): TiledTilesetResult => {
  const record = parseTiledText(text, 'tileset', fromXmlTileset);
  return record.ok ? readTilesetRecord(record.record) : record;
};

export { readTiledTileset };
