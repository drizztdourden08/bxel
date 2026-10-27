/* @layer renderer-app @kind logic */
import { TOOL_CATALOGUE, toolLevel } from '@bxel/mcp';
import type { Grant, ToolName } from '@bxel/mcp';
import { GRANT_TEXT_UI, TOOL_TEXT } from '../sub-components/ProgramGrant.constants';
import { bundleDef } from './bundle-def';
import type { LevelLimits, ToolRowModel } from './grant-rows.type';
import { levelOptions } from './level-options';
import { shownLevel } from './shown-level';

const limitsOf = (kind: ToolRowModel['kind']): LevelLimits => {
  if (kind === 'read') return { edit: GRANT_TEXT_UI.onlyReads };
  return kind === 'write' ? { read: GRANT_TEXT_UI.onlyWrites } : {};
};

const toolRow = (grant: Grant, id: ToolName): ToolRowModel => {
  const entry = TOOL_CATALOGUE[id];
  const overridden = grant.tools[id] !== undefined;
  return {
    id,
    description: TOOL_TEXT[id],
    kind: entry.kind,
    level: shownLevel(toolLevel(grant, id), entry.kind),
    overridden,
    options: levelOptions(limitsOf(entry.kind)),
    name: GRANT_TEXT_UI.toolName(id, bundleDef(entry.bundle).label, overridden),
    followLabel: GRANT_TEXT_UI.followBundle(id),
  };
};

export { toolRow };
