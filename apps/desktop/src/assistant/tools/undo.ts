/* @layer renderer-app @kind logic */
import { ERROR_CODE } from '@bxel/document';
import type { DocumentId } from '@bxel/document';
import { hiddenFailure, MCP_ERROR_CODE, mcpFailure } from '@bxel/mcp';
import type { ToolHandler } from '../assistant.type';
import { lockedReply } from './locked-reply';
import { reply } from './reply';
import type { UndoInput } from './tool-input.type';
import { TOOL_TEXT } from './tools.constants';
import { viewFor } from './view-for';
import { wireTransaction } from './wire-transaction';

const undo: ToolHandler = (input, context) => {
  const { documentId, expectedRevision } = input as UndoInput;
  const view = viewFor(context, documentId);
  if (!view) return reply(hiddenFailure('document'));
  const locked = lockedReply(context, documentId);
  if (locked) return locked;
  const current = view.state.revision;
  if (current !== expectedRevision) {
    return reply(mcpFailure(ERROR_CODE.STALE_REVISION, TOOL_TEXT.stale(current), { currentRevision: current }));
  }
  const newest = view.newest;
  if (!newest) return reply(mcpFailure(ERROR_CODE.NOTHING_TO_UNDO, TOOL_TEXT.nothingToUndo));
  if (newest.actor !== context.call.session.sessionId) return reply(mcpFailure(MCP_ERROR_CODE.UNDO_NOT_OWN, TOOL_TEXT.undoNotOwn));
  const wired = wireTransaction(context.host.undo(documentId as DocumentId));
  if (!wired.ok) return reply(wired);
  return reply({
    ok: true,
    baseRevision: wired.baseRevision,
    revision: wired.revision,
    undone: { label: newest.label, origin: newest.origin },
    changes: wired.changes,
  });
};

export { undo };
