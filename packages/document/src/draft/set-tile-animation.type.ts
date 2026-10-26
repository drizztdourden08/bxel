/* @layer core @kind types */
import type { TileAnimation } from '../model/tilemap.type';

type AnimationEdit = {
  readonly key: number;
  readonly animation: TileAnimation | undefined;
};

export type { AnimationEdit };
