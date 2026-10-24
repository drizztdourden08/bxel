/* @layer renderer-app @kind logic */
import type { ToolHandler } from '../assistant.type';
import { requestMemory } from './request-memory';
import { runEdits } from './run-edits';
import type { EditInput } from './tool-input.type';

const applyEdits: ToolHandler = (input, context) => {
  const edit = input as EditInput;
  const key = edit.clientRequestId === undefined ? null : `${context.call.session.sessionId}:${edit.clientRequestId}`;
  const earlier = key === null ? undefined : requestMemory.recall(key);
  if (earlier) return earlier;
  const result = runEdits(edit, context, 'commit');
  if (key !== null && result.outcome.ok) requestMemory.keep(key, result);
  return result;
};

export { applyEdits };
