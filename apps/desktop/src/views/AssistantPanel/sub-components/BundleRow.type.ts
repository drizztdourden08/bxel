/* @layer renderer-app @kind types */
import type { Level, ToolName } from '@bxel/mcp';
import type { BundleRowModel } from '../behavior/grant-rows.type';

type BundleRowProps = {
  readonly row: BundleRowModel;
  readonly searching: boolean;
  readonly onBundle: (level: Level) => void;
  readonly onTool: (tool: ToolName, level: Level) => void;
  readonly onFollow: (tool: ToolName) => void;
};

export type { BundleRowProps };
