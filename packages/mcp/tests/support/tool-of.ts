/* @layer tests @kind test */
import { documentCommands } from '@bxel/document';
import { buildTools } from '@bxel/mcp';
import type { ToolSpec } from '@bxel/mcp';

const tools = buildTools(documentCommands);

const toolOf = (name: string): ToolSpec => {
  const found = tools.find((tool) => tool.name === name);
  if (!found) throw new Error(`No tool ${name}`);
  return found;
};

export { toolOf };
