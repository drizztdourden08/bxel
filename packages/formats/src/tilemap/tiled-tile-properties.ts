/* @layer core @kind logic */
import type { TileFieldEntry, TilesetEntry } from './tilemap.type';
import { TILED_TYPE } from './tiled-tile-properties.constants';

const tiledValue = (kind: TileFieldEntry['kind'], value: string | number | boolean): string | number | boolean =>
  kind === 'colour' && typeof value === 'string' ? `#ff${value.slice(1)}` : value;

const tiledTileProperties = (tile: TilesetEntry, fields: readonly TileFieldEntry[]): Record<string, unknown>[] =>
  Object.entries(tile.data ?? {}).flatMap(([name, value]) => {
    const field = fields.find((each) => each.name === name);
    if (!field) return [];
    return [{ name, type: TILED_TYPE[field.kind], value: tiledValue(field.kind, value) }];
  });

export { tiledTileProperties };
