/* @layer renderer-app @kind types */
import type { LayerFlag } from '../../../editor/layer-flag.type';
import type { LayerRowModel, LayerStackModel } from '../LayerStack.type';

interface FlagSweepInput {
  model: LayerStackModel;
  rows: readonly LayerRowModel[];
  picked: readonly string[];
  flag: LayerFlag;
}

export type { FlagSweepInput };
