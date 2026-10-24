/* @layer renderer-app @kind types */
interface PresetMoveModel {
  question: string;
  move: () => void;
  keep: () => void;
}

export type { PresetMoveModel };
