/* @layer renderer-app @kind logic */
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import type { StoredTabs } from './stored-tabs.type';

const storedTabsOf = (): StoredTabs | null => {
  const { workspaces, tabs, activeTab } = useWorkspaceStore.getState();
  const workspace = Object.values(workspaces).find((each) => each.kind === 'project');
  if (!workspace) return null;
  const own = tabs.filter((tab) => tab.documentId === workspace.documentId);
  const paths = own.map((tab) => ({ id: tab.id, path: workspace.paths.get(tab.key.id) }));
  const open = paths.flatMap((each) => (each.path === undefined ? [] : [each.path]));
  return { open, active: paths.find((each) => each.id === activeTab)?.path ?? null };
};

export { storedTabsOf };
