/* @layer renderer-app @kind hook */
import { useMemo } from 'react';
import type { TilemapId } from '@bxel/document';
import { lockKindOf } from '../../../editor/layer-lock-kind';
import { useMapContext } from '../../../hooks/useMapContext';
import { useTilemapStore } from '../../../stores/useTilemapStore';
import { mapLayerActions } from '../../../tilemap/map-layer-actions';
import { LAYER_STACK_TEXT, NO_MAPS } from '../LayerStack.constants';
import type { LayerRowModel, LayerStackModel } from '../LayerStack.type';

const onMap = (id: string): void => useTilemapStore.getState().setMap(id as TilemapId);

const useMapLayerModel = (): LayerStackModel => {
  const context = useMapContext();
  return useMemo(() => {
    const { tilemap, layer } = context ?? {};
    if (!context || !tilemap || !layer) {
      return { kind: 'map', owner: '', empty: LAYER_STACK_TEXT.noMap, rows: [], activeId: null, locks: [], maps: NO_MAPS, mapId: null, onMap, frames: 0, actions: mapLayerActions };
    }
    const rows: LayerRowModel[] = tilemap.layers
      .map((each) => ({
        id: each.id,
        name: each.name,
        visible: each.visible,
        mixedVisible: false,
        lock: lockKindOf({ locked: each.locked }),
        mixedLock: false,
        colour: each.colour ?? null,
        note: null,
        thumb: { kind: 'map' as const, layer: each, columns: tilemap.columns, rows: tilemap.rows },
      }))
      .reverse();
    const maps = context.artwork.tilemaps.length > 1 ? context.artwork.tilemaps.map((each) => ({ value: each.id, label: LAYER_STACK_TEXT.map(each.name, each.columns, each.rows) })) : NO_MAPS;
    return {
      kind: 'map',
      owner: LAYER_STACK_TEXT.map(tilemap.name, tilemap.columns, tilemap.rows),
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
