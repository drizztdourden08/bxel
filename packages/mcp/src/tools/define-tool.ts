/* @layer core @kind logic */
import { TOOL_HINTS } from './tool-hints.constants';
import { TOOL_MODE } from './tool-name.constants';
import type { ToolDefinition, ToolName, ToolSpec } from './tool.type';

const defineTool = (name: ToolName, definition: ToolDefinition): ToolSpec => {
  const hints = TOOL_HINTS[name];
  return {
    ...definition,
    name,
    mode: TOOL_MODE[name],
    annotations: {
      title: definition.title,
      readOnlyHint: hints.readOnly,
      destructiveHint: hints.destructive,
      idempotentHint: hints.idempotent,
      openWorldHint: false,
    },
  };
};

export { defineTool };
