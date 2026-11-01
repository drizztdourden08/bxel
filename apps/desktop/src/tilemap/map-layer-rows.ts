/* @layer renderer-app @kind logic */
import { depthOf } from '@bxel/document';
import type { Tilemap } from '@bxel/document';
import { lockKindOf } from '../editor/layer-lock-kind';
import type { LayerRowModel } from '../views/LayerStack/LayerStack.type';

const childCounts = (layers: Tilemap['layers']): Map<string, number> => {
  const counts = new Map<string, number>();
  layers.forEach((layer) => {
    if (layer.parentId !== undefined) counts.set(layer.parentId, (counts.get(layer.parentId) ?? 0) + 1);
  });
  return counts;
};

const mapLayerRows = (tilemap: Tilemap): LayerRowModel[] => {
  const counts = childCounts(tilemap.layers);
  return tilemap.layers
    .map((each) => {
      const group = each.kind === 'group';
      return {
        id: each.id,
        name: each.name,
        visible: each.visible,
        mixedVisible: false,
        lock: lockKindOf(each),
        mixedLock: false,
        colour: each.colour ?? null,
        note: null,
        kind: group ? ('group' as const) : ('pixel' as const),
        depth: depthOf(tilemap.layers, each),
        parentId: each.parentId ?? null,
        childCount: counts.get(each.id) ?? 0,
        viewOpacity: each.opacity ?? 100,
        clip: false,
        exported: true,
        missing: false,
        thumb: group ? null : { kind: 'map' as const, layer: each, columns: tilemap.columns, rows: tilemap.rows },
      };
    })
    .reverse();
};

export { mapLayerRows };
