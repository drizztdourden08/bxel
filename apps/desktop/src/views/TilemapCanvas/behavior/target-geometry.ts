/* @layer renderer-app @kind logic */
import { mapGeometry } from '@bxel/document';
import type { MapGeometry } from '@bxel/document';
import type { MapTarget } from '../../../tilemap/tilemap.type';

const target = (value: Pick<MapTarget, 'tilemap' | 'tileset'>): MapGeometry =>
  mapGeometry({
    columns: value.tilemap.columns,
    rows: value.tilemap.rows,
    tile: { width: value.tileset.tileWidth, height: value.tileset.tileHeight },
    orientation: value.tilemap.orientation,
  });

export { target as targetGeometry };
