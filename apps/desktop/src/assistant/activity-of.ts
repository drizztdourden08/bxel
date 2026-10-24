/* @layer renderer-app @kind logic */
import type { ToolCall, ToolReply } from '@bxel/mcp';
import { fieldOf } from '../assistant-bridge/field-of';
import type { ActivityEntry } from './assistant.type';

const numberOf = (value: unknown): number | null => (typeof value === 'number' ? value : null);

const activityOf = (call: ToolCall, result: ToolReply, started: number): ActivityEntry => {
  const documentId = fieldOf(call.input, 'documentId') ?? fieldOf(result.outcome, 'documentId');
  return {
    at: started,
    client: call.session.displayName,
    tool: call.tool,
    documentId: typeof documentId === 'string' ? documentId : null,
    code: result.outcome.ok ? 'OK' : result.outcome.error.code,
    revisionBefore: numberOf(fieldOf(call.input, 'baseRevision') ?? fieldOf(call.input, 'expectedRevision')),
    revisionAfter: numberOf(fieldOf(result.outcome, 'revision')),
    durationMs: Date.now() - started,
  };
};

export { activityOf };
