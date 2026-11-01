/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import { DRAWING_DEFAULTS } from './drawing-store.constants';
import type { DrawingState } from './drawing-store.type';
import { SYMMETRY_TOGGLE } from './symmetry-toggle.constants';

const useDrawingStore = create<DrawingState>()((set) => ({
  ...DRAWING_DEFAULTS,
  patch: (change) => set(change),
  setFilled: (tool, filled) => set((state) => ({ filled: { ...state.filled, [tool]: filled } })),
  setInk: (tool, ink) => set((state) => ({ inks: { ...state.inks, [tool]: ink } })),
  toggleSymmetryMode: (mode) => set((state) => SYMMETRY_TOGGLE[mode](state)),
}));

export { useDrawingStore };
