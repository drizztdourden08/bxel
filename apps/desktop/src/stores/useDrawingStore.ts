/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import { DRAWING_DEFAULTS, INK_KINDS } from './drawing-store.constants';
import type { DrawingState } from './drawing-store.type';

const useDrawingStore = create<DrawingState>()((set) => ({
  ...DRAWING_DEFAULTS,
  patch: (change) => set(change),
  setFilled: (tool, filled) => set((state) => ({ filled: { ...state.filled, [tool]: filled } })),
  cycleInk: () => set((state) => ({ inkKind: INK_KINDS[(INK_KINDS.indexOf(state.inkKind) + 1) % INK_KINDS.length] ?? 'normal' })),
  toggleSymmetryMode: (mode) =>
    set((state) => (mode === 'diagonal' ? { symmetryDiagonal: !state.symmetryDiagonal } : { symmetryTurn: !state.symmetryTurn })),
}));

export { useDrawingStore };
