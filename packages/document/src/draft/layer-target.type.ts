/* @layer core @kind types */
import type { MapLayer, Tilemap } from '../model/tilemap.type';

type LayerTarget = {
  readonly tilemap: Tilemap;
  readonly layer: MapLayer;
};

export type { LayerTarget };
