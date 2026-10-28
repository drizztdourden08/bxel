/* @layer renderer-app @kind types */
interface LayerKeysInput {
  total: number;
  movable: boolean;
  move: (from: number, to: number) => void;
  extend: (to: number) => void;
}

export type { LayerKeysInput };
