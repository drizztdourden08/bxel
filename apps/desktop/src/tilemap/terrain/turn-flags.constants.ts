/* @layer renderer-app @kind constants */
import type { CellFlags } from '@bxel/document';

const FLIP_ONLY: readonly CellFlags[] = [
  { flipX: false, flipY: false, diagonal: false },
  { flipX: true, flipY: false, diagonal: false },
  { flipX: false, flipY: true, diagonal: false },
  { flipX: true, flipY: true, diagonal: false },
];

const WITH_TURNS: readonly CellFlags[] = [
  ...FLIP_ONLY,
  { flipX: false, flipY: false, diagonal: true },
  { flipX: true, flipY: false, diagonal: true },
  { flipX: false, flipY: true, diagonal: true },
  { flipX: true, flipY: true, diagonal: true },
];

export { FLIP_ONLY, WITH_TURNS };
