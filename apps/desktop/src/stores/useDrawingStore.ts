/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import { DRAWING_DEFAULTS } from './drawing-store.constants';
import type { DrawingState } from './drawing-store.type';

const useDrawingStore = create<DrawingState>()((set) => ({
  ...DRAWING_DEFAULTS,
  patch: (change) => set(change),
  setFilled: (tool, filled) => set((state) => ({ filled: { ...state.filled, [tool]: filled } })),
  setInk: (tool, ink) => set((state) => ({ inks: { ...state.inks, [tool]: ink } })),
  toggleSymmetryMode: (mode) =>
    set((state) => (mode === 'diagonal' ? { symmetryDiagonal: !state.symmetryDiagonal } : { symmetryTurn: !state.symmetryTurn })),
}));

export { useDrawingStore };
