/* @layer renderer-app @kind hook */
import { useMemo } from 'react';
import type { TilemapId } from '@bxel/document';
import { useMapContext } from '../../../hooks/useMapContext';
import { useTilemapStore } from '../../../stores/useTilemapStore';
import { mapLayerActions } from '../../../tilemap/map-layer-actions';
import { mapLayerRows } from '../../../tilemap/map-layer-rows';
import { LAYER_STACK_TEXT, NO_MAPS } from '../LayerStack.constants';
import type { LayerStackModel } from '../LayerStack.type';

const onMap = (id: string): void => useTilemapStore.getState().setMap(id as TilemapId);

const useMapLayerModel = (): LayerStackModel => {
  const context = useMapContext();
  return useMemo(() => {
    const { tilemap, layer } = context ?? {};
    if (!context || !tilemap || !layer) {
      return { kind: 'map', owner: '', ownerMeta: null, empty: LAYER_STACK_TEXT.noMap, rows: [], activeId: null, locks: [], maps: NO_MAPS, mapId: null, onMap, frames: 0, actions: mapLayerActions };
    }
    const rows = mapLayerRows(tilemap);
    const maps = context.artwork.tilemaps.length > 1 ? context.artwork.tilemaps.map((each) => ({ value: each.id, label: LAYER_STACK_TEXT.map(each.name, each.columns, each.rows) })) : NO_MAPS;
    return {
      kind: 'map',
      owner: LAYER_STACK_TEXT.mapName(tilemap.name),
      ownerMeta: LAYER_STACK_TEXT.mapSize(tilemap.columns, tilemap.rows),
      empty: null,
      rows,
      activeId: layer.id,
      locks: ['none', 'pixels'],
      maps,
      mapId: tilemap.id,
      onMap,
      frames: 0,
      actions: mapLayerActions,
    };
  }, [context]);
};

export { useMapLayerModel };
