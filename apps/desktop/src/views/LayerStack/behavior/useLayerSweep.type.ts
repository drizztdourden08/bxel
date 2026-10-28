/* @layer renderer-app @kind types */
import type { LayerFlag } from '../../../editor/layer-flag.type';

interface Sweep {
  flag: LayerFlag;
  value: boolean;
  ids: readonly string[];
}

export type { Sweep };
