/* @layer core @kind types */
import type { TileCollision, TileShape } from '../model/tilemap.type';

type CollisionEdit = {
  readonly key: number;
  readonly collision: TileCollision | undefined;
  readonly path: string;
  readonly layer?: string;
};

type ShapesEdit = {
  readonly keys: readonly number[];
  readonly shapes: readonly TileShape[];
  readonly mode: 'set' | 'add' | 'layer';
  readonly path: string;
};

export type { CollisionEdit, ShapesEdit };
