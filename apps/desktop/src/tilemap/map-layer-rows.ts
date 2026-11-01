/* @layer renderer-app @kind logic */
import { depthOf } from '@bxel/document';
import type { Tilemap } from '@bxel/document';
import { childCounts } from '../editor/child-counts';
import { layerRowHead } from '../editor/layer-row-head';
import type { LayerRowModel } from '../views/LayerStack/LayerStack.type';

const mapLayerRows = (tilemap: Tilemap): LayerRowModel[] => {
  const counts = childCounts(tilemap.layers);
  return tilemap.layers
    .map((each) => {
      const group = each.kind === 'group';
      return {
        ...layerRowHead(each),
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
