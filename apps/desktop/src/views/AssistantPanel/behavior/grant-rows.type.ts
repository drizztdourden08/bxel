/* @layer renderer-app @kind types */
import type { BundleId, Level, ToolKind, ToolName } from '@bxel/mcp';

type LevelOption = {
  readonly value: Level;
  readonly label: string;
  readonly disabled?: string;
};

type LevelLimits = {
  readonly read?: string;
  readonly edit?: string;
};

type ToolRowModel = {
  readonly id: ToolName;
  readonly description: string;
  readonly kind: ToolKind;
  readonly level: Level;
  readonly overridden: boolean;
  readonly options: readonly LevelOption[];
  readonly name: string;
  readonly followLabel: string;
};

type BundleRowModel = {
  readonly id: BundleId;
  readonly label: string;
  readonly description: string;
  readonly level: Level;
  readonly overrides: number;
  readonly options: readonly LevelOption[];
  readonly name: string;
  readonly note: string | null;
  readonly tools: readonly ToolRowModel[];
};

type PresetChoice = 'read_only' | 'edit_documents' | 'full_control' | 'custom' | 'blocked';

export type { BundleRowModel, LevelLimits, LevelOption, PresetChoice, ToolRowModel };
