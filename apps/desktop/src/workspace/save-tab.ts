/* @layer renderer-app @kind logic */
import { failed } from '../files/failed';
import { fileName } from '../files/file-name';
import { CANCELLED } from '../files/files.constants';
import type { FileKit, FileOutcome } from '../files/files.type';
import { reasonOf } from '../files/reason-of';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import { companionsOf } from './companions-of';
import { givePaths } from './give-paths';
import { linkedKeys } from './linked-keys';
import { onDisk } from './on-disk';
import { settleEngine } from './settle-engine';
import { WORKSPACE_TEXT } from './workspace.constants';
import { workspaceTarget } from './workspace-target';
import type { OpenTab } from './workspace.type';
import { writeAssets } from './write-assets';

const giveLinkedPaths = (kit: FileKit, tab: OpenTab, granted: boolean): Promise<boolean> => {
  const target = workspaceTarget(kit, tab.documentId);
  if ('kind' in target) return Promise.resolve(false);
  const missing = linkedKeys(target.view.state.artwork, tab.key).filter((key) => !onDisk(target.workspace, key));
  return givePaths(kit, tab.documentId, missing, granted);
};

const saveTab = async (kit: FileKit, tab: OpenTab, chosen: boolean, granted = false): Promise<FileOutcome> => {
  if (!(await giveLinkedPaths(kit, tab, granted))) return CANCELLED;
  const target = workspaceTarget(kit, tab.documentId);
  if ('kind' in target) return target;
  const path = target.workspace.paths.get(tab.key.id);
  if (path === undefined) return failed(WORKSPACE_TEXT.nothingToSave);
  try {
    await writeAssets(kit, tab.documentId, companionsOf(target.workspace, target.view.state.artwork, tab.key), chosen ? tab.key.id : null);
  } catch (error) {
    return failed(WORKSPACE_TEXT.saveFailed(fileName(path), reasonOf(error)));
  }
  settleEngine(kit.host, tab.documentId);
  const saved = useWorkspaceStore.getState().workspaces[tab.documentId]?.paths.get(tab.key.id) ?? path;
  if (target.workspace.kind !== 'project') kit.paths.remember(tab.documentId, saved);
  return { kind: 'done', path: saved, notice: null };
};

export { saveTab };
