/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import { VIEW_DEFAULTS } from './view-store.constants';
import type { ViewState } from './view-store.type';

const useViewStore = create<ViewState>()((set) => ({
  ...VIEW_DEFAULTS,
  toggleView: (toggle) => set((state) => ({ [toggle]: !state[toggle] })),
  setToggles: (toggles) => set(toggles),
  setTiled: (tiled) => set({ tiled }),
  setGuideColour: (guideColour) => set({ guideColour }),
  setViewport: (viewport) => set({ viewport }),
}));

export { useViewStore };
