/* @layer renderer-app @kind logic */
import { TOOL_CATALOGUE } from '@bxel/mcp';
import type { BundleId, ToolName } from '@bxel/mcp';

const TOOL_IDS = Object.keys(TOOL_CATALOGUE) as ToolName[];

const toolsOfBundle = (bundle: BundleId): readonly ToolName[] => TOOL_IDS.filter((id) => TOOL_CATALOGUE[id].bundle === bundle);

export { toolsOfBundle };
