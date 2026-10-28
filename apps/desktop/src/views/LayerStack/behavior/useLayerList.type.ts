/* @layer renderer-app @kind types */
import type { LayerStackModel } from '../LayerStack.type';
import type { PickHow } from './pick-layer.type';

interface LayerListInput {
  model: LayerStackModel;
  shown: LayerStackModel['rows'];
  movable: boolean;
  pick: (id: string, how: PickHow) => void;
}

export type { LayerListInput };
