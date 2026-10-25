/* @layer renderer-app @kind logic */
import { failed } from '../files/failed';
import { CANCELLED, FILE_TEXT } from '../files/files.constants';
import type { FileKit, FileOutcome } from '../files/files.type';
import { adoptPath } from './adopt-path';
import { currentTab } from './current-tab';
import { keyId } from './key-id';
import { onDisk } from './on-disk';
import { pickAssetPath } from './pick-asset-path';
import { saveTab } from './save-tab';
import { workspaceTarget } from './workspace-target';

const saveActiveAsset = async (kit: FileKit, asNew: boolean): Promise<FileOutcome> => {
  const tab = currentTab();
  if (!tab) return failed(FILE_TEXT.noDocument);
  const target = workspaceTarget(kit, tab.documentId);
  if ('kind' in target) return target;
  const { workspace, view } = target;
  const known = workspace.paths.get(tab.key.id);
  if (!asNew && known !== undefined && !workspace.dirty.has(keyId(tab.key)) && onDisk(workspace, tab.key)) return { kind: 'done', path: known, notice: null };
  const needsPath = asNew || known === undefined;
  let granted = false;
  if (needsPath) {
    const picked = await pickAssetPath(kit.documents, workspace, view.state.artwork, tab.key);
    if (picked === null) return CANCELLED;
    granted = picked.granted;
    adoptPath(kit.host, tab.documentId, tab.key, picked.path);
  }
  return saveTab(kit, tab, needsPath, granted);
};

export { saveActiveAsset };
