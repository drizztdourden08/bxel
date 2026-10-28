/* @layer renderer-app @kind logic */
import type { DocumentId } from '@bxel/document';
import { hiddenFailure } from '@bxel/mcp';
import type { ToolHandler } from '../assistant.type';
import type { GetHistoryInput } from './app-tool-input.type';
import { historyActor } from './history-actor';
import { reply } from './reply';
import { viewFor } from './view-for';

const getHistory: ToolHandler = (input, context) => {
  const { documentId, limit } = input as GetHistoryInput;
  const view = viewFor(context, documentId);
  const listed = view ? context.host.history(documentId as DocumentId) : null;
  if (!view || !listed) return reply(hiddenFailure('document'));
  const start = Math.max(0, listed.entries.length - limit);
  const entries = listed.entries.slice(start).map((entry, at) => ({
    index: start + at,
    label: entry.label,
    actor: historyActor(context, entry),
    origin: entry.origin,
    applied: start + at < listed.cursor,
  }));
  return reply({
    ok: true,
    revision: view.state.revision,
    entries,
    cursor: listed.cursor,
    total: listed.entries.length,
    canUndo: view.canUndo,
    canRedo: view.canRedo,
  });
};

export { getHistory };
