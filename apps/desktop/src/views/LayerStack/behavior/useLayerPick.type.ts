/* @layer renderer-app @kind types */
import type { PickHow } from './pick-layer.type';

interface LayerPick {
  picked: readonly string[];
  pick: (id: string, how: PickHow) => void;
}

export type { LayerPick };
