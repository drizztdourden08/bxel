/* @layer renderer-app @kind constants */
import type { CommandDef } from '@drizztdourden08/brock-react';
import { TOOLS } from '../editor/tools.constants';
import { useToolStore } from '../stores/useToolStore';
import { COMMAND_GROUP, COMMAND_ID } from './keymap.constants';
import { ruled } from './ruled';

const TOOL_COMMANDS: readonly CommandDef[] = TOOLS.map((tool) =>
  ruled({
    id: COMMAND_ID.tool(tool.id),
    label: tool.label,
    group: COMMAND_GROUP.tools,
    chord: tool.key.toUpperCase(),
    run: () => useToolStore.getState().selectTool(tool.id),
  }),
);

export { TOOL_COMMANDS };
