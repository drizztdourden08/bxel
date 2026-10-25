/* @layer renderer-app @kind types */
interface PresetMoveModel {
  question: string;
  move: () => void;
  keep: () => void;
}

interface PresetOffer {
  inProject: boolean;
  presets: number;
  offered: readonly string[];
}

export type { PresetMoveModel, PresetOffer };
