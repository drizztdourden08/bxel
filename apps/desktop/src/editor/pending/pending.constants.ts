/* @layer renderer-app @kind constants */
import { MAX_SPRITE_SIZE } from '@bxel/document';
import type { FlipAxis, TurnDirection } from '@bxel/document';

const PREVIEW_PIXELS = MAX_SPRITE_SIZE * MAX_SPRITE_SIZE;

const FLIP_LABELS: Readonly<Record<FlipAxis, string>> = {
  horizontal: 'Flip horizontal',
  vertical: 'Flip vertical',
};

const TURN_LABELS: Readonly<Record<TurnDirection, string>> = {
  clockwise: 'Rotate 90 clockwise',
  'counter-clockwise': 'Rotate 90 counterclockwise',
  half: 'Rotate 180',
};

const PENDING_TEXT = {
  move: 'Move',
  paste: 'Paste',
  targets: (count: number): string => (count === 1 ? '1 sprite' : `${count} sprites`),
  activeLayer: (name: string): string => `Active layer (${name})`,
  allLayers: 'All layers',
  visibleLayers: 'Visible layers',
  onSprites: (label: string, count: number): string => `${label} on ${count} sprites`,
  overlaps: (count: number): string => (count === 1 ? '1 pair of sprites would overlap on the sheet' : `${count} pairs of sprites would overlap on the sheet`),
  noClipping: 'none',
  clipped: (pixels: number): string => (pixels === 1 ? '1 pixel falls outside the sprite' : `${pixels} pixels fall outside the sprite`),
  resized: (width: number, height: number): string => `none, the canvas becomes ${width} by ${height}`,
  noPreview: 'The preview is too large to draw.',
} as const;

export { FLIP_LABELS, PENDING_TEXT, PREVIEW_PIXELS, TURN_LABELS };
