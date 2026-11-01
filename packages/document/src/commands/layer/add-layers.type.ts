/* @layer core @kind types */
import type { Layer, Sprite } from '../../model/sprite.type';
import type { PickedLayer } from './layer.type';

type LayerBuild = (
  sprite: Sprite,
  names: readonly string[],
  anchor: PickedLayer | undefined,
) => { readonly layer: Layer; readonly at: number };

export type { LayerBuild };
