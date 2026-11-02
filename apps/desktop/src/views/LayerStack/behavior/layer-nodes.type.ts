/* @layer renderer-app @kind types */
import type { LayerRowModel } from '../LayerStack.type';

interface LayerNode {
  row: LayerRowModel;
  children: LayerNode[];
}

export type { LayerNode };
