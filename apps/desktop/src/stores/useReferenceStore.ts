/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import type { ReferenceState } from './reference-store.type';

const useReferenceStore = create<ReferenceState>()((set) => ({
  entries: {},
  settle: (path, entry) => set((state) => ({ entries: { ...state.entries, [path]: entry } })),
  forget: (path) =>
    set((state) => {
      const { [path]: dropped, ...rest } = state.entries;
      return dropped === undefined ? state : { entries: rest };
    }),
}));

export { useReferenceStore };
