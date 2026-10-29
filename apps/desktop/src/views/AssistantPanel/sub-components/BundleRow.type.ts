/* @layer renderer-app @kind types */
import type { Level, ToolRowId } from '@bxel/mcp';
import type { BundleRowModel } from '../behavior/grant-rows.type';

type BundleRowProps = {
  readonly row: BundleRowModel;
  readonly searching: boolean;
  readonly onBundle: (level: Level) => void;
  readonly onTool: (tool: ToolRowId, level: Level) => void;
  readonly onFollow: (tool: ToolRowId) => void;
};

export type { BundleRowProps };
