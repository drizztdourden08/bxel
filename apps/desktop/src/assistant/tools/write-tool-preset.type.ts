/* @layer renderer-app @kind types */
import type { ToolPreset } from '../../editor/presets/tool-preset.type';

interface WriteToolPresetOptions {
  base: ToolPreset;
  fields: Readonly<Record<string, unknown>> | undefined;
  memberPath: string;
  verb: string;
}

export type { WriteToolPresetOptions };
