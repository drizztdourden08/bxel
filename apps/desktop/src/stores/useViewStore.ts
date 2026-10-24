/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import { VIEW_DEFAULTS } from './view-store.constants';
import type { ViewState } from './view-store.type';

const useViewStore = create<ViewState>()((set) => ({
  ...VIEW_DEFAULTS,
  toggleGrid: () => set((state) => ({ grid: !state.grid })),
  setTiled: (tiled) => set({ tiled }),
  setViewport: (viewport) => set({ viewport }),
}));

export { useViewStore };
