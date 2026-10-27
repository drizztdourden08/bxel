/* @layer helper @kind logic */
import type { ToolDescriptor } from '@bxel/mcp';

const signatureOf = (tools: readonly ToolDescriptor[]): string => JSON.stringify(tools.map((tool) => [tool.name, tool.description]));

export { signatureOf };
