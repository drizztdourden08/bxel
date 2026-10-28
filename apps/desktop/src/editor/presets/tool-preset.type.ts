/* @layer renderer-app @kind types */
import type { OptionValues } from '../tool-options/tool-options.type';

interface ToolPreset {
  id: string;
  name: string;
  member: string;
  fields: OptionValues;
  builtin?: boolean;
}

interface PresetDraft {
  member: string;
  name: string;
  ticked: readonly string[];
  replaces?: string;
}

export type { PresetDraft, ToolPreset };
