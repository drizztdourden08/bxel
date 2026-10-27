/* @layer renderer-app @kind types */
import type { BundleId, Level, ToolName } from '@bxel/mcp';
import type { BundleRowModel, PresetChoice } from './grant-rows.type';

type ProgramGrantModel = {
  readonly query: string;
  readonly rows: readonly BundleRowModel[];
  readonly shown: number;
  readonly preset: PresetChoice;
  readonly setQuery: (value: string) => void;
  readonly setPreset: (choice: PresetChoice) => void;
  readonly setBundle: (id: BundleId, level: Level) => void;
  readonly setTool: (id: ToolName, level: Level) => void;
  readonly followBundle: (id: ToolName) => void;
  readonly setMayRestart: (on: boolean) => void;
};

export type { ProgramGrantModel };
