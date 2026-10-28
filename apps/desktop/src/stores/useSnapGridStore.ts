/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import type { SnapGridState } from './snap-grid-store.type';

const useSnapGridStore = create<SnapGridState>()((set) => ({
  grid: null,
  set: (grid) => set({ grid }),
}));

export { useSnapGridStore };
