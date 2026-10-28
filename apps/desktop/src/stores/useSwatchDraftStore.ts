/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import type { SwatchDraftState } from './palette-panel-store.type';

const useSwatchDraftStore = create<SwatchDraftState>()((set) => ({
  draft: null,
  show: (draft) => set({ draft }),
  hide: () => set({ draft: null }),
}));

export { useSwatchDraftStore };
