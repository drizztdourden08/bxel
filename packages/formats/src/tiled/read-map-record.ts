/* @layer core @kind logic */
import { listOf } from './list-of';
import { numberOf } from './number-of';
import { readLayers } from './read-layers';
import { readMapShape } from './read-map-shape';
import { recOf } from './rec-of';
import type { Rec } from './rec.type';
import type { TiledMapResult } from './tiled.type';
import { tilesetRef } from './tileset-ref';

const readMapRecord = (record: Rec): TiledMapResult => {
  const shape = readMapShape(record);
  if ('ok' in shape) return shape;
  const layers = readLayers(record['layers'], shape.width * shape.height);
  if ('ok' in layers) return layers;
  return {
    ok: true,
    map: {
      ...shape,
      staggerAxis: record['staggeraxis'] === 'x' ? 'x' : 'y',
      staggerIndex: record['staggerindex'] === 'even' ? 'even' : 'odd',
      hexSideLength: Math.max(0, Math.floor(numberOf(record['hexsidelength'], 0))),
      layers: layers.layers,
      tilesets: listOf(record['tilesets']).map((entry) => tilesetRef(recOf(entry))),
      skippedLayers: layers.skipped,
    },
  };
};

export { readMapRecord };
