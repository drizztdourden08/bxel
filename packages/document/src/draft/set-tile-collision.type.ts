/* @layer core @kind types */
import type { TileCollision } from '../model/tilemap.type';

type CollisionEdit = {
  readonly key: number;
  readonly collision: TileCollision | undefined;
  readonly path: string;
};

export type { CollisionEdit };
