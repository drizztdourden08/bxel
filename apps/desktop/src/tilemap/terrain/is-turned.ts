/* @layer renderer-app @kind logic */
import type { TerrainVariant } from '@bxel/document';

const isTurned = (variant: TerrainVariant): boolean => variant.flipX === true || variant.flipY === true || variant.diagonal === true;

export { isTurned };
