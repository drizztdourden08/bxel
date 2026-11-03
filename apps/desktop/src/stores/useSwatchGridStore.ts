/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import type { SwatchGridState } from './swatch-grid-store.type';

const useSwatchGridStore = create<SwatchGridState>()((set, get) => ({
  handle: null,
  attach: (handle) => set({ handle }),
  detach: (handle) => {
    if (get().handle === handle) set({ handle: null });
  },
}));

export { useSwatchGridStore };
