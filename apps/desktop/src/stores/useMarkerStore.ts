/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import type { MarkerState } from './marker-store.type';

const useMarkerStore = create<MarkerState>()((set) => ({
  marker: null,
  setMarker: (marker) => set({ marker }),
}));

export { useMarkerStore };
