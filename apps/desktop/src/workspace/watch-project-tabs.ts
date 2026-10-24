/* @layer renderer-app @kind logic */
import { useProjectStore } from '../stores/useProjectStore';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import { parseStoredTabs } from './parse-stored-tabs';
import { storedTabsOf } from './stored-tabs-of';
import { TABS_SAVE_DELAY_MS } from './workspace.constants';

const save = (): void => {
  const { port, project } = useProjectStore.getState();
  const entry = storedTabsOf();
  if (!port || !project || !entry || entry.open.length === 0) return;
  const known = parseStoredTabs(port.read().projectTabs);
  const id = project.manifest.projectId;
  if (JSON.stringify(known[id]) === JSON.stringify(entry)) return;
  const others = Object.entries(known).filter(([each]) => each !== id);
  port.patch({ projectTabs: Object.fromEntries([...others, [id, entry]]) });
};

const watchProjectTabs = (): (() => void) => {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const stop = useWorkspaceStore.subscribe((state, before) => {
    if (state.tabs === before.tabs && state.activeTab === before.activeTab) return;
    clearTimeout(timer);
    timer = setTimeout(save, TABS_SAVE_DELAY_MS);
  });
  return () => {
    clearTimeout(timer);
    stop();
  };
};

export { watchProjectTabs };
