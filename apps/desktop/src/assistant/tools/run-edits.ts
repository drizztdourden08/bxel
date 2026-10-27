/* @layer renderer-app @kind logic */
import type { Artwork, DocumentId, TransactionMode, TransactionRequest } from '@bxel/document';
import { checkPatchPixels, hiddenFailure, MCP_ERROR_CODE, mcpFailure } from '@bxel/mcp';
import type { Failure, McpResult, ToolReply } from '@bxel/mcp';
import { usePendingStore } from '../../stores/usePendingStore';
import type { ToolContext } from '../assistant.type';
import { platformLock } from './platform-lock';
import { refusedEdit } from './refused-edit';
import { renderDraft } from './render-draft';
import { reply } from './reply';
import { toCommandSteps } from './to-command-steps';
import type { EditInput } from './tool-input.type';
import { TOOL_TEXT } from './tools.constants';
import { viewFor } from './view-for';
import { wireTransaction } from './wire-transaction';

const ownerBusy = (documentId: string): boolean => usePendingStore.getState().pending?.documentId === documentId;

const refusal = (input: EditInput, artwork: Artwork, mode: TransactionMode): Failure | null => {
  const locked = platformLock(artwork, input.steps);
  if (locked) return locked;
  if (mode === 'commit' && ownerBusy(input.documentId)) return mcpFailure(MCP_ERROR_CODE.DOCUMENT_BUSY, TOOL_TEXT.busy);
  return checkPatchPixels(input.steps);
};

const requestOf = (input: EditInput, context: ToolContext, mode: TransactionMode, withDraft: boolean): McpResult<TransactionRequest> => {
  const steps = toCommandSteps(input.steps);
  if (!steps.ok) return steps;
  const { session } = context.call;
  return {
    ok: true,
    value: {
      documentId: input.documentId as DocumentId,
      baseRevision: input.baseRevision,
      mode,
      origin: 'mcp',
      actor: session.sessionId,
      label: TOOL_TEXT.labelOf(session.displayName, input.label),
      steps: steps.value,
      previewPixels: mode === 'preview' ? (input.previewPixels ?? 0) : 0,
      ...(withDraft ? { withDraft: true } : {}),
    },
  };
};

const runEdits = (input: EditInput, context: ToolContext, mode: TransactionMode, render?: number): ToolReply => {
  const view = viewFor(context, input.documentId);
  if (!view) return reply(hiddenFailure('document'));
  const refused = refusal(input, view.state.artwork, mode);
  if (refused) return reply(refused);
  const request = requestOf(input, context, mode, render !== undefined);
  if (!request.ok) return reply(request);
  const blocked = refusedEdit(context, request.value, view.state.artwork);
  if (blocked) return reply(blocked);
  const result = context.host.execute(request.value);
  const images = render !== undefined && result.ok ? renderDraft(context, input.documentId, result, render) : [];
  return reply(wireTransaction(result), images);
};

export { runEdits };
