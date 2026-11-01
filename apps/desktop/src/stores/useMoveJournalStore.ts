/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import { JOURNAL_LIMIT } from '../file-ops/file-ops.constants';
import type { MoveJournalState } from './move-journal-store.type';

const useMoveJournalStore = create<MoveJournalState>()((set, get) => ({
  entries: [],
  record: (label, moves) => {
    const id = (get().entries.at(-1)?.id ?? 0) + 1;
    set((state) => ({ entries: [...state.entries, { id, label, moves }].slice(-JOURNAL_LIMIT) }));
    return id;
  },
  take: (id) => {
    const found = get().entries.find((entry) => entry.id === id) ?? null;
    if (found) set((state) => ({ entries: state.entries.filter((entry) => entry.id !== id) }));
    return found;
  },
  takeLast: () => {
    const last = get().entries.at(-1) ?? null;
    if (last) set((state) => ({ entries: state.entries.slice(0, -1) }));
    return last;
  },
  clear: () => set({ entries: [] }),
}));

export { useMoveJournalStore };
