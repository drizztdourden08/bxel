/* @layer renderer-app @kind constants */
import { MAX_SPRITE_SIZE } from '@bxel/document';
import type { FlipAxis, TurnDirection } from '@bxel/document';
import type { BoundsPolicy } from '@bxel/raster';

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

const BOUNDS_CHOICES: readonly BoundsPolicy[] = ['crop', 'expand', 'cancel'];

const BOUNDS_LABELS: Readonly<Record<BoundsPolicy, string>> = {
  crop: 'Crop',
  expand: 'Expand canvas',
  cancel: 'Cancel if it does not fit',
};

const PENDING_TEXT = {
  rotate: (angle: number): string => `Rotate ${angle} degrees`,
  scale: (width: number, height: number): string => `Scale to ${width} by ${height}`,
  move: 'Move',
  paste: 'Paste',
  targets: (count: number): string => (count === 1 ? '1 sprite' : `${count} sprites`),
  activeLayer: (name: string): string => `Active layer (${name})`,
  allLayers: 'All layers',
  currentFrame: (at: number, total: number): string => `Current frame (${at} of ${total})`,
  allFrames: (total: number): string => `All frames (${total})`,
  noClipping: 'none',
  clipped: (pixels: number): string => (pixels === 1 ? '1 pixel falls outside the sprite' : `${pixels} pixels fall outside the sprite`),
  resized: (width: number, height: number): string => `none, the canvas becomes ${width} by ${height}`,
  noPreview: 'The preview is too large to draw.',
} as const;

const ROTATE_RANGE = { min: -360, max: 360 } as const;

const SCALE_RANGE = { min: 1, max: MAX_SPRITE_SIZE } as const;

export { BOUNDS_CHOICES, BOUNDS_LABELS, FLIP_LABELS, PENDING_TEXT, PREVIEW_PIXELS, ROTATE_RANGE, SCALE_RANGE, TURN_LABELS };
