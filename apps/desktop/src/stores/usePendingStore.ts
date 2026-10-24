/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import { pendingOutcome } from '../editor/pending/pending-outcome';
import { PENDING_DEFAULTS } from './pending-store.constants';
import type { PendingState } from './pending-store.type';

const usePendingStore = create<PendingState>()((set) => ({
  ...PENDING_DEFAULTS,
  begin: (pending) => set({ pending, outcome: pendingOutcome(pending) }),
  revise: (spec) =>
    set((state) => {
      if (!state.pending) return state;
      const pending = { ...state.pending, spec };
      return { pending, outcome: pendingOutcome(pending) };
    }),
  setEditing: (editing) => set((state) => (state.pending ? { pending: { ...state.pending, editing } } : state)),
  clear: () => set(PENDING_DEFAULTS),
}));

export { usePendingStore };
