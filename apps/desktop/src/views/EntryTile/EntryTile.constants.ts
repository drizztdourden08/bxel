/* @layer renderer-app @kind constants */
import type { VirtualSize } from '@drizztdourden08/tessera';

const ENTRY_TILE_TEXT = {
  sprite: (width: number, height: number): string => `sprite, ${width} by ${height}`,
  animation: (frames: number): string => `animation, ${frames === 1 ? '1 frame' : `${frames} frames`}`,
  picked: 'Picked',
  film: 'Animation',
  frames: (count: number): string => (count === 1 ? '1 frame' : `${count} frames`),
  slices: (count: number): string => (count === 1 ? '1 slice' : `${count} slices`),
  twin: 'Identical to another sprite',
  strip: (cells: number): string => `Looks like a strip of ${cells}`,
  elsewhere: (names: readonly string[]): string => `Also on ${names.join(', ')}`,
  warning: '!',
  notOnSheet: 'Not on this sheet',
  onSheets: (names: readonly string[]): string => `On ${names.join(', ')}`,
} as const;

const TILE_SIZES: readonly { readonly token: VirtualSize; readonly px: number }[] = [
  { token: 'size-48', px: 48 },
  { token: 'size-56', px: 56 },
  { token: 'size-64', px: 64 },
  { token: 'size-80', px: 80 },
  { token: 'size-96', px: 96 },
  { token: 'size-128', px: 128 },
  { token: 'size-160', px: 160 },
  { token: 'size-192', px: 192 },
  { token: 'size-224', px: 224 },
  { token: 'size-256', px: 256 },
];

const TILE_EXTRA = { width: 24, height: 48 } as const;

const MEDIA_ASPECT = 1;

const PLAY_MIN_MS = 40;

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

export { ENTRY_TILE_TEXT, MEDIA_ASPECT, PLAY_MIN_MS, REDUCED_MOTION, TILE_EXTRA, TILE_SIZES };
