/* @layer renderer-app @kind logic */
import type { AssetKey, DocumentId } from '@bxel/document';
import { confirmAction } from '@drizztdourden08/brock-react';
import { fileName } from '../files/file-name';
import type { FileKit } from '../files/files.type';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import { keyId } from './key-id';
import { WORKSPACE_TEXT } from './workspace.constants';

const forget = (documentId: DocumentId, keys: readonly AssetKey[]): void =>
  useWorkspaceStore.getState().patch(documentId, (workspace) => {
    const paths = new Map(workspace.paths);
    const saved = new Map(workspace.saved);
    const dirty = new Set(workspace.dirty);
    for (const key of keys) {
      paths.delete(key.id);
      saved.delete(keyId(key));
      dirty.delete(keyId(key));
    }
    return { ...workspace, paths, saved, dirty };
  });

const trashRemoved = async (kit: FileKit, documentId: DocumentId, keys: readonly AssetKey[]): Promise<readonly string[]> => {
  const workspace = useWorkspaceStore.getState().workspaces[documentId];
  const files = keys.flatMap((key) => {
    const path = workspace?.paths.get(key.id);
    return path === undefined ? [] : [path];
  });
  if (files.length === 0) {
    forget(documentId, keys);
    return [];
  }
  const sure = await confirmAction({
    title: WORKSPACE_TEXT.trashTitle,
    message: WORKSPACE_TEXT.trashMessage(files.map(fileName).join(', ')),
    confirmLabel: WORKSPACE_TEXT.trashConfirm,
    cancelLabel: WORKSPACE_TEXT.trashCancel,
  });
  if (!sure) return [];
  for (const path of files) await kit.documents.trash(path).catch(() => undefined);
  forget(documentId, keys);
  return files;
};

export { trashRemoved };
