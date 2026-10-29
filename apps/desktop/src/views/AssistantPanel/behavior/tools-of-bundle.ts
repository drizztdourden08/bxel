/* @layer renderer-app @kind logic */
import { TOOL_ROWS } from '@bxel/mcp';
import type { BundleId, ToolRowId } from '@bxel/mcp';
import { TOOL_IDS } from './tools-of-bundle.constants';

const toolsOfBundle = (bundle: BundleId): readonly ToolRowId[] => TOOL_IDS.filter((id) => TOOL_ROWS[id].bundle === bundle);

export { toolsOfBundle };
