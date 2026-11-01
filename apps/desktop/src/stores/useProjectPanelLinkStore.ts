/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import type { ProjectPanelLinkState } from './project-panel-link.type';

const useProjectPanelLinkStore = create<ProjectPanelLinkState>()((set, get) => ({
  snapshot: null,
  command: null,
  publish: (snapshot) => set({ snapshot }),
  send: (command) => set({ command }),
  take: () => {
    const { command } = get();
    if (command !== null) set({ command: null });
    return command;
  },
}));

export { useProjectPanelLinkStore };
