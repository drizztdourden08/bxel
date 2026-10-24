/* @layer renderer-app @kind hook */
import { removeSwatchSet, upsertSwatchSet } from '@bxel/project';
import { create } from 'zustand';
import type { ProjectSetsState } from './project-sets-store.type';

const useProjectSetsStore = create<ProjectSetsState>()((set, get) => ({
  projectName: null,
  sets: [],
  open: (name, sets) => set({ projectName: name, sets }),
  close: () => set({ projectName: null, sets: [] }),
  put: (next) => {
    if (get().projectName === null) return null;
    const result = upsertSwatchSet(get().sets, next);
    if (result.ok) set({ sets: result.value });
    return result;
  },
  drop: (setId) => set((state) => ({ sets: removeSwatchSet(state.sets, setId) })),
}));

export { useProjectSetsStore };
