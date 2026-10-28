/* @layer renderer-app @kind types */
import type { ToolPreset } from '../../editor/presets/tool-preset.type';
import type { ToolId } from '../../editor/tool.type';

interface PresetListProps {
  tool: ToolId;
}

interface PresetRowProps {
  preset: ToolPreset;
  active: boolean;
  slot: number | null;
}

export type { PresetListProps, PresetRowProps };
