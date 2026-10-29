/* @layer core @kind logic */
import { DEFAULT_LAYOUT_COLUMNS } from '../model/tilemap-limits.constants';
import type { Tileset } from '../model/tilemap.type';

const layoutColumns = (tileset: Tileset): number => tileset.columns ?? DEFAULT_LAYOUT_COLUMNS;

export { layoutColumns };
