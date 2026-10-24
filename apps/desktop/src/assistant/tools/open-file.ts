/* @layer renderer-app @kind logic */
import type { DocumentId } from '@bxel/document';
import { hiddenFailure, MCP_ERROR_CODE, mcpFailure } from '@bxel/mcp';
import { fileName } from '../../files/file-name';
import { isArtworkPath } from '../../files/is-artwork-path';
import { useAssistantStore } from '../../stores/useAssistantStore';
import { useDocumentStore } from '../../stores/useDocumentStore';
import type { ToolContext, ToolHandler } from '../assistant.type';
import { loadRecent } from './load-recent';
import { recentIdOf } from './recent-id-of';
import { reply } from './reply';
import type { OpenInput } from './tool-input.type';
import { TOOL_TEXT } from './tools.constants';
import { visibleRecent } from './visible-recent';

const opened = (context: ToolContext, documentId: DocumentId, path: string, alreadyOpen: boolean) => {
  const view = context.host.view(documentId);
  return reply({
    ok: true,
    documentId,
    revision: view?.state.revision ?? 1,
    alreadyOpen,
    readOnly: view?.state.readOnly ?? false,
    outcome: view?.state.readOnly ? 'recoverable' : 'ok',
    fileName: fileName(path),
  });
};

const openFile: ToolHandler = async (input, context) => {
  const { file, activate } = input as OpenInput;
  if (!('recentId' in file)) return reply(hiddenFailure('project'));
  const entry = (await visibleRecent(context)).find((recent) => recentIdOf(recent.path) === file.recentId);
  if (!entry) return reply(hiddenFailure('file'));
  if (!isArtworkPath(entry.path)) return reply(mcpFailure(MCP_ERROR_CODE.FILE_NOT_SUPPORTED, TOOL_TEXT.notBxel));
  const existing = context.paths.documentAt(entry.path);
  if (existing !== undefined) return opened(context, existing, entry.path, true);
  const loaded = await loadRecent(context.documents, entry.path);
  if (!loaded.ok) return reply(loaded);
  const { report, path } = loaded.value;
  if (report.artwork === null) return reply(hiddenFailure('file'));
  const documentId = context.host.open({ artwork: report.artwork, readOnly: report.readOnly });
  context.paths.remember(documentId, path);
  useAssistantStore.getState().markOpened(documentId);
  if (activate) useDocumentStore.getState().setActive(documentId);
  return opened(context, documentId, path, false);
};

export { openFile };
