/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import type { ReadoutState } from './readout-store.type';

const useReadoutStore = create<ReadoutState>()((set) => ({
  pointer: null,
  zoom: 1,
  setPointer: (pointer) => set({ pointer }),
  setZoom: (zoom) => set({ zoom }),
}));

export { useReadoutStore };
