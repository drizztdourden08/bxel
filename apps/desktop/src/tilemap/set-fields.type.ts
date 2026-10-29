/* @layer renderer-app @kind types */
import type { TileField } from '@bxel/document';

interface FieldsPatch {
  fields?: readonly TileField[];
  collisionLayers?: readonly string[];
}

export type { FieldsPatch };
