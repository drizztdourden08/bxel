/* @layer renderer-app @kind logic */
import type { AssetKey, DocumentId } from '@bxel/document';
import { fileName } from '../files/file-name';
import type { FileKit } from '../files/files.type';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import { keyId } from './key-id';
import { withoutAsset } from './without-asset';
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
    return { ...workspace, paths, saved, dirty, base: keys.reduce(withoutAsset, workspace.base) };
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
  const migrated = keys.every((key) => workspace?.migration?.keys.some((each) => keyId(each) === keyId(key)));
  const names = files.map(fileName).join(', ');
  const sure = await kit.prompts.confirm({
    title: migrated ? WORKSPACE_TEXT.migratedTitle : WORKSPACE_TEXT.trashTitle,
    message: migrated ? WORKSPACE_TEXT.migratedMessage(names) : WORKSPACE_TEXT.trashMessage(names),
    confirmLabel: WORKSPACE_TEXT.trashConfirm,
    cancelLabel: WORKSPACE_TEXT.trashCancel,
  });
  if (!sure) return [];
  for (const path of files) await kit.documents.trash(path).catch(() => undefined);
  forget(documentId, keys);
  return files;
};

export { trashRemoved };
