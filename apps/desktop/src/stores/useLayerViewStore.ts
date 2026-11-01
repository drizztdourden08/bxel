/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import { LAYER_VIEW_DEFAULTS } from './layer-view-store.constants';
import type { LayerViewState } from './layer-view-store.type';
import { useDocumentStore } from './useDocumentStore';

const useLayerViewStore = create<LayerViewState>()((set) => ({
  ...LAYER_VIEW_DEFAULTS,
  reset: () => set((state) => ({ ...LAYER_VIEW_DEFAULTS, thumbSize: state.thumbSize })),
  select: (selected, anchor) => set({ selected, anchor }),
  setFilter: (filter) => set({ filter }),
  setColourFilter: (colourFilter) => set({ colourFilter }),
  setScope: (scope) => set({ scope }),
  setRenaming: (renamingId) => set({ renamingId }),
  setThumbSize: (thumbSize) => set({ thumbSize }),
  toggleFold: (id) => set((state) => ({ folded: state.folded.includes(id) ? state.folded.filter((each) => each !== id) : [...state.folded, id] })),
  setFolded: (id, folded) => set((state) => ({ folded: folded ? [...state.folded.filter((each) => each !== id), id] : state.folded.filter((each) => each !== id) })),
}));

useDocumentStore.subscribe((state, previous) => {
  if (state.activeId !== previous.activeId) useLayerViewStore.getState().reset();
});

export { useLayerViewStore };
