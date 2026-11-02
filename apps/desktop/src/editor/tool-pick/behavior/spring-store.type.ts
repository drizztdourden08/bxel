/* @layer renderer-app @kind types */
import type { ToolId } from '../../tool.type';

interface SpringState {
  tool: ToolId | null;
  borrowed: ToolId | null;
  borrow: (home: ToolId | null, borrowed: ToolId | null) => void;
}

export type { SpringState };
