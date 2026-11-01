/* @layer renderer-app @kind types */
import type { LayerRowModel } from '../LayerStack.type';

type IndentDirection = 'in' | 'out';

interface LayerKeysInput {
  rows: readonly LayerRowModel[];
  folded: readonly string[];
  movable: boolean;
  move: (from: number, to: number) => void;
  extend: (to: number) => void;
  indent: (id: string, direction: IndentDirection) => void;
  setFolded: (id: string, folded: boolean) => void;
}

export type { IndentDirection, LayerKeysInput };
