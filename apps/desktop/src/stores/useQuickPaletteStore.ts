/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import type { QuickPaletteState } from './quick-palette-store.type';

const useQuickPaletteStore = create<QuickPaletteState>()((set) => ({
  open: false,
  at: { x: 0, y: 0 },
  show: (at) => set({ open: true, at }),
  close: () => set({ open: false }),
}));

export { useQuickPaletteStore };
