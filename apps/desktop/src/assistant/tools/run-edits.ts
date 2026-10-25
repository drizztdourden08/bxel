/* @layer renderer-app @kind logic */
import type { DocumentId, TransactionMode, TransactionRequest } from '@bxel/document';
import { checkPatchPixels, hiddenFailure, MCP_ERROR_CODE, mcpFailure } from '@bxel/mcp';
import type { ToolReply } from '@bxel/mcp';
import { usePendingStore } from '../../stores/usePendingStore';
import type { ToolContext } from '../assistant.type';
import { platformLock } from './platform-lock';
import { refusedEdit } from './refused-edit';
import { reply } from './reply';
import { toCommandSteps } from './to-command-steps';
import type { EditInput } from './tool-input.type';
import { TOOL_TEXT } from './tools.constants';
import { viewFor } from './view-for';
import { wireTransaction } from './wire-transaction';

const ownerBusy = (documentId: string): boolean => usePendingStore.getState().pending?.documentId === documentId;

const runEdits = (input: EditInput, context: ToolContext, mode: TransactionMode): ToolReply => {
  const view = viewFor(context, input.documentId);
  if (!view) return reply(hiddenFailure('document'));
  const locked = platformLock(view.state.artwork, input.steps);
  if (locked) return reply(locked);
  if (mode === 'commit' && ownerBusy(input.documentId)) return reply(mcpFailure(MCP_ERROR_CODE.DOCUMENT_BUSY, TOOL_TEXT.busy));
  const limit = checkPatchPixels(input.steps);
  if (limit) return reply(limit);
  const steps = toCommandSteps(input.steps);
  if (!steps.ok) return reply(steps);
  const { session } = context.call;
  const request: TransactionRequest = {
    documentId: input.documentId as DocumentId,
    baseRevision: input.baseRevision,
    mode,
    origin: 'mcp',
    actor: session.sessionId,
    label: TOOL_TEXT.labelOf(session.displayName, input.label),
    steps: steps.value,
    previewPixels: mode === 'preview' ? (input.previewPixels ?? 0) : 0,
  };
  const refused = refusedEdit(context, request, view.state.artwork);
  if (refused) return reply(refused);
  const result = context.host.execute(request);
  return reply(wireTransaction(result));
};

export { runEdits };
