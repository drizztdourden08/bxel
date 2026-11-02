/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import { HISTORY_LIMIT } from './properties-subject.constants';
import { readPin } from './read-pin';
import { sameRef } from './same-ref';
import { writePin } from './write-pin';
import type { SubjectStoreState } from './properties-subject.type';

const useSubjectStore = create<SubjectStoreState>()((set, get) => ({
  past: [],
  future: [],
  pinTo: (ref, route) => {
    const current = readPin();
    if (current !== null && sameRef(current, ref)) {
      if (route !== undefined) writePin(ref, route);
      return;
    }
    set({ past: current === null ? get().past : [...get().past, current].slice(-HISTORY_LIMIT), future: [] });
    writePin(ref, route);
  },
  unpin: () => writePin(null),
  back: () => {
    const previous = get().past.at(-1);
    if (previous === undefined) return;
    const current = readPin();
    set({ past: get().past.slice(0, -1), future: current === null ? get().future : [current, ...get().future] });
    writePin(previous);
  },
  forward: () => {
    const next = get().future[0];
    if (next === undefined) return;
    const current = readPin();
    set({ future: get().future.slice(1), past: current === null ? get().past : [...get().past, current] });
    writePin(next);
  },
}));

export { useSubjectStore };
