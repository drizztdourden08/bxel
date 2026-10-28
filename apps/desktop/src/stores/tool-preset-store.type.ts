/* @layer renderer-app @kind types */
import type { PresetDraft, ToolPreset } from '../editor/presets/tool-preset.type';

interface ToolPresetState {
  user: readonly ToolPreset[];
  draft: PresetDraft | null;
  load: (user: readonly ToolPreset[]) => void;
  save: (preset: ToolPreset) => void;
  remove: (id: string) => void;
  rename: (id: string, name: string) => void;
  move: (id: string, delta: number) => void;
  openDraft: (draft: PresetDraft | null) => void;
}

export type { ToolPresetState };
