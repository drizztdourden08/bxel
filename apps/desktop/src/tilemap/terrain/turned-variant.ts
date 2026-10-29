/* @layer renderer-app @kind logic */
import type { CellFlags, TerrainVariant } from '@bxel/document';

const turnedVariant = (key: number, flags: CellFlags): TerrainVariant => ({
  key,
  weight: 1,
  ...(flags.flipX ? { flipX: true } : {}),
  ...(flags.flipY ? { flipY: true } : {}),
  ...(flags.diagonal ? { diagonal: true } : {}),
});

export { turnedVariant };
