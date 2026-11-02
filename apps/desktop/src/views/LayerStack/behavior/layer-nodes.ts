/* @layer renderer-app @kind logic */
import type { LayerRowModel } from '../LayerStack.type';
import type { LayerNode } from './layer-nodes.type';

const layerNodes = (rows: readonly LayerRowModel[]): LayerNode[] => {
  const nodes = rows.map((row): LayerNode => ({ row, children: [] }));
  const byId = new Map(nodes.map((node) => [node.row.id, node]));
  const top: LayerNode[] = [];
  for (const node of nodes) {
    const parent = node.row.parentId === null ? undefined : byId.get(node.row.parentId);
    (parent ? parent.children : top).push(node);
  }
  return top;
};

export { layerNodes };
