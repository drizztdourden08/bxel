/* @layer renderer-app @kind types */
import type { Level } from '@bxel/mcp';
import type { ToolRowModel } from '../behavior/grant-rows.type';

type ToolRowProps = {
  readonly row: ToolRowModel;
  readonly onChange: (level: Level) => void;
  readonly onFollow: () => void;
};

export type { ToolRowProps };
