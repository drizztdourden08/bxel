/* @layer renderer-app @kind constants */
import type { CommandDef } from '@drizztdourden08/brock-react';
import { TOOLS } from '../editor/tools.constants';
import { useToolStore } from '../stores/useToolStore';
import { editorCommand } from './editor-command';
import { COMMAND_GROUP, COMMAND_ID } from './keymap.constants';

const TOOL_COMMANDS: readonly CommandDef[] = TOOLS.map((tool) =>
  editorCommand({
    id: COMMAND_ID.tool(tool.id),
    label: tool.label,
    group: COMMAND_GROUP.tools,
    chord: tool.key.toUpperCase(),
    run: () => useToolStore.getState().selectTool(tool.id),
  }),
);

export { TOOL_COMMANDS };
