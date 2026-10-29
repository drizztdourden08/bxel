/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import { SELECTION_HISTORY_LIMIT } from './selection-history-store.constants';
import type { SelectionHistoryState } from './selection-history-store.type';

const useSelectionHistoryStore = create<SelectionHistoryState>()((set, get) => ({
  undo: [],
  redo: [],
  last: null,
  record: (step) => set((state) => ({ undo: [...state.undo, step].slice(-SELECTION_HISTORY_LIMIT), redo: [] })),
  popUndo: () => {
    const step = get().undo.at(-1) ?? null;
    if (step) set((state) => ({ undo: state.undo.slice(0, -1) }));
    return step;
  },
  popRedo: () => {
    const step = get().redo.at(-1) ?? null;
    if (step) set((state) => ({ redo: state.redo.slice(0, -1) }));
    return step;
  },
  pushUndo: (step) => set((state) => ({ undo: [...state.undo, step] })),
  pushRedo: (step) => set((state) => ({ redo: [...state.redo, step] })),
  remember: (last) => set({ last }),
  reset: () => set({ undo: [], redo: [], last: null }),
}));

export { useSelectionHistoryStore };
