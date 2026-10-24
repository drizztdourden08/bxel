/* @layer renderer-app @kind logic */
import { currentPick } from '../editor/current-pick';
import { useDocumentStore } from '../stores/useDocumentStore';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import { currentTab } from '../workspace/current-tab';
import type { PresetLive } from './preset-live.type';

const presetLive = (): PresetLive | null => {
  const { activeId, host } = useDocumentStore.getState();
  const view = activeId === null ? null : host.view(activeId);
  if (activeId === null || !view) return null;
  const workspace = useWorkspaceStore.getState().workspaces[activeId];
  return {
    documentId: activeId,
    readOnly: view.state.readOnly,
    context: { artwork: view.state.artwork, tab: currentTab()?.key ?? null, spriteId: currentPick().spriteId, project: workspace?.kind === 'project' },
  };
};

export { presetLive };
