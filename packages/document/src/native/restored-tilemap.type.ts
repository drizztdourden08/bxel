/* @layer core @kind types */
import type { MapLayer, Tilemap } from '../model/tilemap.type';
import type { MapLayerJson, TilemapJson } from './document-json.type';
import type { EntryCheck } from './entry-check.type';
import type { DamagedMapLayer } from './load-report.type';

type LayerContext = {
  readonly shell: TilemapJson;
  readonly layer: MapLayerJson;
  readonly keys: ReadonlySet<number> | null;
  readonly source: EntryCheck;
};

type RestoredLayer = { readonly layer: MapLayer; readonly damage: DamagedMapLayer | null };

type RestoredTilemap = { readonly tilemap: Tilemap; readonly damage: readonly DamagedMapLayer[] };

export type { LayerContext, RestoredLayer, RestoredTilemap };
