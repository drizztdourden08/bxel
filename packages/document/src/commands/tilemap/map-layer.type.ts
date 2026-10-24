/* @layer core @kind types */
import type { LayerTarget } from '../../draft/layer-target.type';
import type { Point } from '../../model/geometry.type';
import type { TilemapId } from '../../model/ids.type';
import type { MapLayer, Tileset } from '../../model/tilemap.type';
import type { MapLayerRef } from '../../schema/command-options.type';
import type { EntityRef } from '../../schema/entity-ref.type';

type PickedMapLayer = {
  readonly layer: MapLayer;
  readonly index: number;
};

type OpenedLayer = LayerTarget & { readonly tileset: Tileset };

type LayerOptions = {
  readonly tilemap: EntityRef<TilemapId>;
  readonly layer: MapLayerRef;
};

type Placement = { readonly points?: readonly Point[]; readonly cells?: readonly Point[] };

type PlaceOptions = LayerOptions & Placement;

export type { LayerOptions, OpenedLayer, PickedMapLayer, PlaceOptions, Placement };
