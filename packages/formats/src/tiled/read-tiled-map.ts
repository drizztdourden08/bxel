/* @layer core @kind logic */
import { fromXmlMap } from './from-xml-map';
import { parseTiledText } from './parse-tiled-text';
import { readMapRecord } from './read-map-record';
import type { TiledMapResult } from './tiled.type';

const readTiledMap = (text: string): TiledMapResult => {
  const record = parseTiledText(text, 'map', fromXmlMap);
  return record.ok ? readMapRecord(record.record) : record;
};

export { readTiledMap };
