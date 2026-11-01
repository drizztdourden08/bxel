/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import type { PaletteImportState } from './palette-panel-store.type';

const usePaletteImportStore = create<PaletteImportState>()((set) => ({
  request: null,
  open: (request) => set({ request }),
  close: () => set({ request: null }),
}));

export { usePaletteImportStore };
