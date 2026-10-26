/* @layer renderer-app @kind types */
interface PresetPickState {
  picked: string;
  pick: (picked: string) => void;
}

export type { PresetPickState };
