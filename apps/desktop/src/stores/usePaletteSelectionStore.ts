/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import type { PaletteSelectionState } from './palette-panel-store.type';

const usePaletteSelectionStore = create<PaletteSelectionState>()((set) => ({
  bankId: null,
  selected: [],
  anchor: null,
  select: (selection) => set(selection),
  clear: () => set({ selected: [], anchor: null }),
}));

export { usePaletteSelectionStore };
