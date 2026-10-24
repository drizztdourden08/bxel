/* @layer renderer-app @kind logic */
import type { ToolDef } from '../../../editor/tool.type';
import { COMMAND_ID } from '../../../keymap/keymap.constants';
import type { HintSpec } from '../../ActionHint';

const toolHint = (def: ToolDef): HintSpec => ({
  name: def.label,
  description: def.description,
  shortcuts: [{ command: COMMAND_ID.tool(def.id) }],
});

export { toolHint };
