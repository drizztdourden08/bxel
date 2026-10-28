/* @layer renderer-app @kind types */
import type { ToolPreset } from '../presets/tool-preset.type';
import type { OptionValue } from './tool-options.type';

interface ToolStoredSettings {
  toolOptions?: Readonly<Record<string, OptionValue>>;
  toolPresets?: readonly ToolPreset[];
  toolPrefs?: Readonly<Record<string, unknown>>;
}

export type { ToolStoredSettings };
