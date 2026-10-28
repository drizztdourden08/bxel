/* @layer renderer-app @kind types */
import type { ToolPreset } from '../../../editor/presets/tool-preset.type';

interface PresetMenuProps {
  preset: ToolPreset;
  onRename: () => void;
}

export type { PresetMenuProps };
