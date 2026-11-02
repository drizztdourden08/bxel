/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import type { DropLayerState } from './drop-layer-store.type';

const useDropLayerStore = create<DropLayerState>()((set) => ({
  offer: null,
  show: (offer) => set({ offer }),
  hide: () => set({ offer: null }),
}));

export { useDropLayerStore };
