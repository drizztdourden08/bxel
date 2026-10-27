/* @layer renderer-app @kind logic */
import { ERROR_CODE } from '@bxel/document';
import type { DocumentId } from '@bxel/document';
import { hiddenFailure, MCP_ERROR_CODE, mcpFailure } from '@bxel/mcp';
import type { ToolReply } from '@bxel/mcp';
import type { ToolContext, ToolHandler } from '../assistant.type';
import { lockedReply } from './locked-reply';
import { reply } from './reply';
import type { UndoInput } from './tool-input.type';
import { TOOL_TEXT } from './tools.constants';
import { viewFor } from './view-for';
import { wireTransaction } from './wire-transaction';

type Direction = 'undo' | 'redo';

type StepInput = UndoInput & { readonly direction?: Direction; readonly steps?: number };

type Done = { revision: number; changes: unknown; label: string; origin: 'ui' | 'mcp'; count: number };

const entryFor = (context: ToolContext, documentId: string, direction: Direction) => {
  const listed = context.host.history(documentId as DocumentId);
  if (!listed) return null;
  return (direction === 'undo' ? listed.entries[listed.cursor - 1] : listed.entries[listed.cursor]) ?? null;
};

const nothing = (direction: Direction): ToolReply =>
  reply(direction === 'undo' ? mcpFailure(ERROR_CODE.NOTHING_TO_UNDO, TOOL_TEXT.nothingToUndo) : mcpFailure(ERROR_CODE.NOTHING_TO_REDO, TOOL_TEXT.nothingToRedo));

const notOwn = (direction: Direction): ToolReply =>
  reply(mcpFailure(MCP_ERROR_CODE.UNDO_NOT_OWN, direction === 'undo' ? TOOL_TEXT.undoNotOwn : TOOL_TEXT.redoNotOwn));

const stepOnce = (context: ToolContext, documentId: string, direction: Direction, done: Done | null): Done | ToolReply => {
  const entry = entryFor(context, documentId, direction);
  if (!entry) return nothing(direction);
  if (entry.actor !== context.call.session.sessionId) return notOwn(direction);
  const id = documentId as DocumentId;
  const wired = wireTransaction(direction === 'undo' ? context.host.undo(id) : context.host.redo(id));
  if (!wired.ok) return reply(wired);
  return { revision: Number(wired.revision), changes: wired.changes, label: entry.label, origin: entry.origin, count: (done?.count ?? 0) + 1 };
};

const undo: ToolHandler = (input, context) => {
  const { documentId, expectedRevision, direction = 'undo', steps = 1 } = input as StepInput;
  const view = viewFor(context, documentId);
  if (!view) return reply(hiddenFailure('document'));
  const locked = lockedReply(context, documentId);
  if (locked) return locked;
  const current = view.state.revision;
  if (current !== expectedRevision) {
    return reply(mcpFailure(ERROR_CODE.STALE_REVISION, TOOL_TEXT.stale(current), { currentRevision: current }));
  }
  let done: Done | null = null;
  for (let at = 0; at < steps; at += 1) {
    const next = stepOnce(context, documentId, direction, done);
    if ('outcome' in next) {
      if (done === null) return next;
      break;
    }
    done = next;
  }
  if (done === null) return nothing(direction);
  return reply({
    ok: true,
    baseRevision: current,
    revision: done.revision,
    direction,
    count: done.count,
    undone: { label: done.label, origin: done.origin },
    changes: done.changes,
  });
};

export { undo };
