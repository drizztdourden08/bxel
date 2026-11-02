/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import type { QuickPaletteState } from './quick-palette-store.type';

const useQuickPaletteStore = create<QuickPaletteState>()((set) => ({
  open: false,
  at: { x: 0, y: 0 },
  holding: false,
  show: (at, holding = false) => set({ open: true, at, holding }),
  release: () => set({ holding: false }),
  close: () => set({ open: false, holding: false }),
}));

export { useQuickPaletteStore };
