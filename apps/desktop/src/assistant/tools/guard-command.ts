/* @layer renderer-app @kind logic */
import { ERROR_CODE } from '@bxel/document';
import { checkCommand, hiddenFailure, MCP_ERROR_CODE, mcpFailure } from '@bxel/mcp';
import type { ToolReply } from '@bxel/mcp';
import { useDocumentStore } from '../../stores/useDocumentStore';
import { usePendingStore } from '../../stores/usePendingStore';
import type { ManifestEntry } from '../command-manifest/manifest.type';
import type { ToolContext } from '../assistant.type';
import { activeRevision } from './active-revision';
import type { RunCommandInput } from './app-tool-input.type';
import { commandFail } from './command-fail';
import { lockedDocument } from './locked-document';
import { lockedFailure } from './locked-failure';
import { reply } from './reply';
import { TOOL_TEXT } from './tools.constants';
import { viewFor } from './view-for';

const editFailure = (context: ToolContext, input: RunCommandInput, activeId: string): ToolReply | null => {
  if (lockedDocument(context, activeId)) return reply(lockedFailure());
  if (usePendingStore.getState().pending?.documentId === activeId) return commandFail(MCP_ERROR_CODE.DOCUMENT_BUSY, TOOL_TEXT.busy);
  const current = activeRevision();
  if (input.revision === undefined || current === null || input.revision === current) return null;
  return reply(mcpFailure(ERROR_CODE.STALE_REVISION, TOOL_TEXT.stale(current), { currentRevision: current }));
};

const guardCommand = (context: ToolContext, input: RunCommandInput, entry: ManifestEntry): ToolReply | null => {
  const { session } = context.call;
  const denied = checkCommand(session.grant, 'run_command', { what: `run_command ${input.id}`, area: entry.area, changes: entry.effect !== 'show' }, session.displayName);
  if (denied) return reply(denied);
  const { activeId } = useDocumentStore.getState();
  if (entry.effect === 'show' || activeId === null) return null;
  if (viewFor(context, activeId) === null) return reply(hiddenFailure('document'));
  return entry.effect === 'edit' ? editFailure(context, input, activeId) : null;
};

export { guardCommand };
