/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import type { PaletteSheetState } from './palette-panel-store.type';

const usePaletteSheetStore = create<PaletteSheetState>()((set) => ({
  request: null,
  open: (request) => set({ request }),
  close: () => set({ request: null }),
}));

export { usePaletteSheetStore };
