/* @layer renderer-app @kind hook */
import { useMemo } from 'react';
import { MAX_LAYER_DEPTH } from '@bxel/document';
import type { TreeMoveRequest, TreeReorder } from '@drizztdourden08/tessera';
import { useLayerViewStore } from '../../../stores/useLayerViewStore';
import type { LayerStackModel } from '../LayerStack.type';
import { dropFits } from './drop-fits';
import { layerNodes } from './layer-nodes';
import type { LayerTreeInput, LayerTreeProps } from './useLayerTree.type';

const reorderOf = (model: LayerStackModel, rows: LayerStackModel['rows']): TreeReorder => ({
  onMove: (move: TreeMoveRequest) => model.actions.moveTo({ keys: move.keys, parentKey: move.parentKey, index: move.index }),
  canDrop: (move: TreeMoveRequest) => dropFits(rows, move),
  maxDepth: MAX_LAYER_DEPTH + 1,
});

const useLayerTree = ({ model, rows, picked, pick, pickKeys, movable }: LayerTreeInput): LayerTreeProps => {
  const folded = useLayerViewStore((state) => state.folded);
  const items = useMemo(() => layerNodes(rows), [rows]);
  const expandedKeys = useMemo(() => rows.filter((row) => row.kind === 'group' && !folded.includes(row.id)).map((row) => row.id), [rows, folded]);
  const selected = useMemo(() => new Set(picked), [picked]);
  return {
    items,
    expandedKeys,
    onExpandedChange: (keys) => {
      const { setFolded } = useLayerViewStore.getState();
      for (const row of rows) {
        if (row.kind === 'group' && keys.includes(row.id) === folded.includes(row.id)) setFolded(row.id, !keys.includes(row.id));
      }
    },
    selection: { selected, onChange: pickKeys, mode: 'multiple' },
    onActivate: (node) => pick(node.row.id, 'replace'),
    reorder: movable ? reorderOf(model, rows) : undefined,
  };
};

export { useLayerTree };
