/* @layer renderer-app @kind logic */
import type { DocumentId } from '@bxel/document';
import { hiddenFailure, MCP_ERROR_CODE, mcpFailure } from '@bxel/mcp';
import type { ToolReply } from '@bxel/mcp';
import { fileName } from '../../files/file-name';
import { useAssistantStore } from '../../stores/useAssistantStore';
import { useDocumentStore } from '../../stores/useDocumentStore';
import { useWorkspaceStore } from '../../stores/useWorkspaceStore';
import { findAssetTab } from '../../workspace/find-asset-tab';
import { focusTab } from '../../workspace/focus-tab';
import { openArtworkPath } from '../../workspace/open-artwork-path';
import type { ToolContext } from '../assistant.type';
import { reply } from './reply';
import { wireAsset } from './wire-asset';
import type { OpenedFile, OpenTarget } from './tool-input.type';
import { toolKit } from './tool-kit';

const openedAt = (context: ToolContext, path: string): OpenedFile | null => {
  const tab = findAssetTab(path);
  if (tab) return { documentId: tab.documentId, key: tab.key };
  const documentId = context.paths.documentAt(path);
  return documentId === undefined ? null : { documentId, key: null };
};

const opened = (context: ToolContext, found: OpenedFile, path: string, alreadyOpen: boolean): ToolReply => {
  const view = context.host.view(found.documentId);
  return reply({
    ok: true,
    documentId: found.documentId,
    revision: view?.state.revision ?? 1,
    alreadyOpen,
    readOnly: view?.state.readOnly ?? false,
    outcome: view?.state.readOnly ? 'recoverable' : 'ok',
    fileName: fileName(path),
    asset: wireAsset(view, found.key),
    legacy: useWorkspaceStore.getState().workspaces[found.documentId]?.kind === 'legacy',
  });
};

const restoreFocus = (activeId: DocumentId | null, activeTab: string | null): void => {
  const tab = useWorkspaceStore.getState().tabs.find((each) => each.id === activeTab);
  if (tab) focusTab(tab);
  else if (activeId !== null) useDocumentStore.getState().setActive(activeId);
};

const openTarget = async (context: ToolContext, target: OpenTarget, activate: boolean): Promise<ToolReply> => {
  const existing = openedAt(context, target.path);
  if (existing) return opened(context, existing, target.path, true);
  const path = target.viaRecent ? await context.documents.openRecent(target.path) : target.path;
  if (path === null) return reply(hiddenFailure('file'));
  const { activeId } = useDocumentStore.getState();
  const { activeTab } = useWorkspaceStore.getState();
  const outcome = await openArtworkPath(toolKit(context), path);
  if (outcome.kind === 'failed') return reply(mcpFailure(MCP_ERROR_CODE.FILE_NOT_SUPPORTED, outcome.message));
  const found = openedAt(context, path);
  if (!found) return reply(hiddenFailure('file'));
  useAssistantStore.getState().markOpened(found.documentId);
  if (!activate) restoreFocus(activeId, activeTab);
  return opened(context, found, path, false);
};

export { openTarget };
