/* @layer renderer-app @kind logic */
import type { DocumentId } from '@bxel/document';
import { toast } from '@drizztdourden08/brock-react';
import { fileName } from '../files/file-name';
import type { FileKit } from '../files/files.type';
import { useDocumentStore } from '../stores/useDocumentStore';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import { findAssetTab } from '../workspace/find-asset-tab';
import { HEALTH_TEXT } from './project-health.constants';
import { reloadWorkspace } from './reload-workspace';

type Held = { readonly documentId: DocumentId; readonly path: string };

const isClean = (documentId: DocumentId): boolean => {
  const workspace = useWorkspaceStore.getState().workspaces[documentId];
  return useDocumentStore.getState().host.view(documentId)?.clean === true && workspace?.dirty.size === 0;
};

const heldBy = (files: readonly string[]): readonly Held[] => {
  const found = new Map<DocumentId, Held>();
  for (const path of files) {
    const tab = findAssetTab(path);
    if (tab !== null && !found.has(tab.documentId)) found.set(tab.documentId, { documentId: tab.documentId, path });
  }
  return [...found.values()];
};

const reloadOpenFiles = async (kit: FileKit, files: readonly string[]): Promise<void> => {
  for (const held of heldBy(files)) {
    if (isClean(held.documentId)) await reloadWorkspace(kit, held.documentId, held.path);
    else toast(HEALTH_TEXT.reloadKept(fileName(held.path)), { variant: 'warning' });
  }
};

export { reloadOpenFiles };
