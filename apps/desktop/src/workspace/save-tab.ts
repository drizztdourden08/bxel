/* @layer renderer-app @kind logic */
import { failed } from '../files/failed';
import { fileName } from '../files/file-name';
import { reasonOf } from '../files/reason-of';
import type { FileKit, FileOutcome } from '../files/files.type';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import { companionsOf } from './companions-of';
import { settleEngine } from './settle-engine';
import { writeAssets } from './write-assets';
import { WORKSPACE_TEXT } from './workspace.constants';
import type { OpenTab } from './workspace.type';

const saveTab = async (kit: FileKit, tab: OpenTab, chosen: boolean): Promise<FileOutcome> => {
  const workspace = useWorkspaceStore.getState().workspaces[tab.documentId];
  const view = kit.host.view(tab.documentId);
  const target = workspace?.paths.get(tab.key.id);
  if (!workspace || !view || target === undefined) return failed(WORKSPACE_TEXT.nothingToSave);
  try {
    await writeAssets(kit, tab.documentId, companionsOf(workspace, view.state.artwork, tab.key), chosen ? tab.key.id : null);
  } catch (error) {
    return failed(WORKSPACE_TEXT.saveFailed(fileName(target), reasonOf(error)));
  }
  settleEngine(kit.host, tab.documentId);
  const path = useWorkspaceStore.getState().workspaces[tab.documentId]?.paths.get(tab.key.id) ?? target;
  if (workspace.kind !== 'project') kit.paths.remember(tab.documentId, path);
  return { kind: 'done', path, notice: null };
};

export { saveTab };
