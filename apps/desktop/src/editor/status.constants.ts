/* @layer renderer-app @kind constants */
import type { Point } from '@bxel/raster';

const STATUS_TEXT = {
  region: 'Editor status',
  outside: 'Outside',
  saved: 'Saved',
  unsaved: 'Unsaved changes',
  cursor: (at: Point): string => `x ${at.x}, y ${at.y}`,
  zoom: (zoom: number): string => `${Math.round(zoom * 100)}%`,
  colour: (index: number, name: string): string => `${index} ${name}`,
} as const;

export { STATUS_TEXT };
