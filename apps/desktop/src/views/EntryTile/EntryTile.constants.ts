/* @layer renderer-app @kind constants */

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
  at: (x: number, y: number): string => `at ${x}, ${y}`,
  notOnSheet: 'Not on this sheet',
  onSheets: (names: readonly string[]): string => `On ${names.join(', ')}`,
} as const;

const THUMB_CACHE_LIMIT = 600;

const TILE_EXTRA = { width: 24, height: 48 } as const;

const MEDIA_ASPECT = 1;

const PLAY_MIN_MS = 40;

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

export { ENTRY_TILE_TEXT, MEDIA_ASPECT, PLAY_MIN_MS, REDUCED_MOTION, THUMB_CACHE_LIMIT, TILE_EXTRA };
