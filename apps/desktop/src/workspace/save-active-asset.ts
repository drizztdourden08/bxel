/* @layer renderer-app @kind logic */
import { failed } from '../files/failed';
import { CANCELLED, FILE_TEXT } from '../files/files.constants';
import type { FileKit, FileOutcome } from '../files/files.type';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import { adoptPath } from './adopt-path';
import { currentTab } from './current-tab';
import { keyId } from './key-id';
import { onDisk } from './on-disk';
import { pickAssetPath } from './pick-asset-path';
import { saveTab } from './save-tab';
import { WORKSPACE_TEXT } from './workspace.constants';

const saveActiveAsset = async (kit: FileKit, asNew: boolean): Promise<FileOutcome> => {
  const tab = currentTab();
  const workspace = tab ? useWorkspaceStore.getState().workspaces[tab.documentId] : undefined;
  const view = tab ? kit.host.view(tab.documentId) : null;
  if (!tab || !workspace || !view) return failed(FILE_TEXT.noDocument);
  if (workspace.legacy !== null || view.state.readOnly) return failed(WORKSPACE_TEXT.readOnlyLegacy);
  const known = workspace.paths.get(tab.key.id);
  const needsPath = asNew || known === undefined;
  if (!needsPath && !workspace.dirty.has(keyId(tab.key)) && onDisk(workspace, tab.key)) return { kind: 'done', path: known, notice: null };
  if (needsPath) {
    const picked = await pickAssetPath(kit.documents, workspace, view.state.artwork, tab.key);
    if (picked === null) return CANCELLED;
    adoptPath(kit.host, tab.documentId, tab.key, picked);
  }
  return saveTab(kit, tab, needsPath);
};

export { saveActiveAsset };
