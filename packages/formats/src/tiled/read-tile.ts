/* @layer core @kind logic */
import { numberOf } from './number-of';
import { readImage } from './read-image';
import { readProperties } from './read-properties';
import { readShapes } from './read-shapes';
import type { Rec } from './rec.type';
import type { TiledTile } from './tiled.type';

const readTile = (record: Rec): TiledTile => ({
  id: numberOf(record['id'], -1),
  image: readImage(record),
  shapes: readShapes(record['objectgroup']),
  properties: readProperties(record['properties']),
});

export { readTile };
