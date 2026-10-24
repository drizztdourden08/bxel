/* @layer renderer-app @kind constants */
import type { Point } from '@bxel/raster';

const STATUS_TEXT = {
  region: 'Editor status',
  outside: 'Outside',
  saved: 'Saved',
  unsaved: 'Unsaved changes',
  recovered: 'Recovered, not saved',
  help: 'Help',
  helpValue: 'Canvas controls',
  cursor: (at: Point): string => `x ${at.x}, y ${at.y}`,
  zoom: (zoom: number): string => `${Math.round(zoom * 100)}%`,
  colour: (index: number, name: string): string => `${index} ${name}`,
} as const;

const HELP_PRIORITY = 3;

export { HELP_PRIORITY, STATUS_TEXT };
