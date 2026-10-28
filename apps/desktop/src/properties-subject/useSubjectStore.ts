/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import { HISTORY_LIMIT } from './properties-subject.constants';
import { sameRef } from './same-ref';
import type { SubjectStoreState } from './properties-subject.type';

const useSubjectStore = create<SubjectStoreState>()((set) => ({
  pin: null,
  past: [],
  future: [],
  pinTo: (ref) =>
    set((state) => {
      if (state.pin !== null && sameRef(state.pin, ref)) return state;
      return { pin: ref, past: state.pin === null ? state.past : [...state.past, state.pin].slice(-HISTORY_LIMIT), future: [] };
    }),
  unpin: () => set({ pin: null }),
  back: () =>
    set((state) => {
      const previous = state.past.at(-1);
      if (previous === undefined) return state;
      return { pin: previous, past: state.past.slice(0, -1), future: state.pin === null ? state.future : [state.pin, ...state.future] };
    }),
  forward: () =>
    set((state) => {
      const next = state.future[0];
      if (next === undefined) return state;
      return { pin: next, future: state.future.slice(1), past: state.pin === null ? state.past : [...state.past, state.pin] };
    }),
  restore: (pin) => set({ pin, past: [], future: [] }),
}));

export { useSubjectStore };
