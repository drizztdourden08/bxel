/* @layer renderer-app @kind types */
import type { ToolId } from '../editor/tool.type';

interface SkillometerState {
  picks: Readonly<Partial<Record<ToolId, number>>>;
  told: readonly ToolId[];
  count: (tool: ToolId) => number;
  markTold: (tool: ToolId) => void;
  reset: () => void;
}

export type { SkillometerState };
