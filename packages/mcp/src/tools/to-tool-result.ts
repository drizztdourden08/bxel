/* @layer core @kind logic */
import type { ToolOutcome, ToolResult } from './tool-result.type';

const toToolResult = (outcome: ToolOutcome, summary: string): ToolResult => {
  if (outcome.ok) return { content: [{ type: 'text', text: summary }], structuredContent: outcome };
  const { code, message, retry } = outcome.error;
  return {
    content: [{ type: 'text', text: `${code}: ${message} (retry: ${retry})` }],
    structuredContent: outcome,
    isError: true,
  };
};

export { toToolResult };
