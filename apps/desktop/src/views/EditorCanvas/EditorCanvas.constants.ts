/* @layer renderer-app @kind constants */
import type { TileMode } from '../../stores/view-store.type';
import type { PixelTiling } from '../PixelViewport';

const EDITOR_CANVAS_TEXT = {
  label: 'Sprite canvas',
  empty: 'No sprite is open.',
} as const;

const TILING_OF: Readonly<Record<TileMode, PixelTiling>> = {
  off: { x: false, y: false },
  x: { x: true, y: false },
  y: { x: false, y: true },
  both: { x: true, y: true },
};

const OVERLAY_TOKENS = {
  axis: '--c-tertiary',
  cursor: '--c-danger',
} as const;

const AXIS_GRAB = { across: 6, along: 14 } as const;

const AXIS_DASH: readonly number[] = [4, 3];

const AXIS_GRIP = 5;

export { AXIS_DASH, AXIS_GRAB, AXIS_GRIP, EDITOR_CANVAS_TEXT, OVERLAY_TOKENS, TILING_OF };
