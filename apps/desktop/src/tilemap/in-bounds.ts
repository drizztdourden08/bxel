/* @layer renderer-app @kind logic */
import type { Point, Tilemap } from '@bxel/document';

const inBounds = (tilemap: Tilemap, at: Point): boolean => at.x >= 0 && at.y >= 0 && at.x < tilemap.columns && at.y < tilemap.rows;

export { inBounds };
