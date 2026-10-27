/* @layer core @kind logic */
import { TOOL_CATALOGUE } from '../catalogue/tool-catalogue.constants';
import { TOOL_HINTS } from './tool-hints.constants';
import type { ToolDefinition, ToolName, ToolSpec } from './tool.type';

const defineTool = (name: ToolName, definition: ToolDefinition): ToolSpec => {
  const hints = TOOL_HINTS[name];
  return {
    ...definition,
    name,
    bundle: TOOL_CATALOGUE[name].bundle,
    kind: TOOL_CATALOGUE[name].kind,
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
