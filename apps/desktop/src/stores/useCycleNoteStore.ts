/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import type { CycleNoteState } from './cycle-note-store.type';

const useCycleNoteStore = create<CycleNoteState>()((set) => ({
  text: null,
  set: (text) => set({ text }),
}));

export { useCycleNoteStore };
