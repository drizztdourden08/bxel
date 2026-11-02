/* @layer renderer-app @kind types */
import type { TreeProps } from '@drizztdourden08/tessera';
import type { LayerStackModel } from '../LayerStack.type';
import type { LayerNode } from './layer-nodes.type';
import type { PickHow } from './pick-layer.type';

interface LayerTreeInput {
  model: LayerStackModel;
  rows: LayerStackModel['rows'];
  picked: readonly string[];
  pick: (id: string, how: PickHow) => void;
  pickKeys: (keys: ReadonlySet<string>) => void;
  movable: boolean;
}

type LayerTreeProps = Pick<TreeProps<LayerNode>, 'items' | 'expandedKeys' | 'onExpandedChange' | 'selection' | 'onActivate' | 'reorder'>;

export type { LayerTreeInput, LayerTreeProps };
