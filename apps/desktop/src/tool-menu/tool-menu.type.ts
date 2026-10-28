/* @layer renderer-app @kind types */
import type { ToolPreset } from '../editor/presets/tool-preset.type';
import type { ToolMember, ToolSlot } from '../editor/tool-catalogue/tool-catalogue.type';
import type { OptionSpec } from '../editor/tool-options/tool-options.type';
import type { PixelIconName } from '../icons/pixel-icon.type';

interface FlyoutModel {
  slot: ToolSlot;
  members: readonly ToolMember[];
  shown: ToolMember;
  options: readonly OptionSpec[];
  presets: readonly ToolPreset[];
  matched: ToolPreset | undefined;
  hidden: boolean;
  hasContent: boolean;
}

interface FlyoutRow {
  id: string;
  label: string;
  icon?: PixelIconName | 'save' | 'rotate-ccw' | 'panel-right' | 'eye' | 'eye-off';
  kind: 'radio' | 'check' | 'action';
  checked: boolean;
  disabled: boolean;
  reason?: string;
  run: () => void;
}

interface FlyoutSection {
  id: string;
  label?: string;
  rows: readonly FlyoutRow[];
}

export type { FlyoutModel, FlyoutRow, FlyoutSection };
