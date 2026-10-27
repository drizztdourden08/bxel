/* @layer renderer-app @kind logic */
import { TOOL_CATALOGUE } from '@bxel/mcp';
import type { BundleId, ToolName } from '@bxel/mcp';
import { TOOL_IDS } from './tools-of-bundle.constants';

const toolsOfBundle = (bundle: BundleId): readonly ToolName[] => TOOL_IDS.filter((id) => TOOL_CATALOGUE[id].bundle === bundle);

export { toolsOfBundle };
