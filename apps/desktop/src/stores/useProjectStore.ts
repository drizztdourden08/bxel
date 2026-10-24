/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import type { ProjectState } from './project-store.type';

const useProjectStore = create<ProjectState>()((set) => ({
  project: null,
  port: null,
  recents: [],
  dialog: false,
  settingsDialog: false,
  held: [],
  open: (project) => set({ project }),
  close: () => set({ project: null, settingsDialog: false }),
  update: (manifest) => set((state) => (state.project ? { project: { ...state.project, manifest } } : state)),
  markGranted: (folderId) =>
    set((state) =>
      state.project
        ? {
            project: {
              ...state.project,
              folders: state.project.folders.map((folder) => (folder.folderId === folderId ? { ...folder, granted: true } : folder)),
            },
          }
        : state,
    ),
  setPort: (port) => set({ port }),
  setRecents: (recents) => set({ recents }),
  showDialog: (dialog) => set({ dialog }),
  showSettings: (settingsDialog) => set({ settingsDialog }),
  setFolders: (folders) => set((state) => (state.project ? { project: { ...state.project, folders } } : state)),
  setHeld: (held) => set({ held }),
}));

export { useProjectStore };
