/* @layer renderer-app @kind types */
import type { OptionValues } from '../tool-options/tool-options.type';

interface ToolPreset {
  id: string;
  name: string;
  member: string;
  fields: OptionValues;
  builtin?: boolean;
  project?: boolean;
}

interface PresetDraft {
  member: string;
  name: string;
  ticked: readonly string[];
  replaces?: string;
  inProject?: boolean;
}

export type { PresetDraft, ToolPreset };
