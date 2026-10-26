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
  noCursor: 'Move the pointer over the image first.',
  cursorCopied: 'Copied the cursor position.',
  cursorFailed: 'Could not copy the cursor position.',
  cursor: (at: Point): string => `x ${at.x}, y ${at.y}`,
  zoom: (zoom: number): string => `${Math.round(zoom * 100)}%`,
  colourLabel: (position: 1 | 2): string => `Colour ${position}`,
  colour: (index: number, name: string): string => `${index} ${name}`,
} as const;

const HELP_PRIORITY = 3;

export { HELP_PRIORITY, STATUS_TEXT };
