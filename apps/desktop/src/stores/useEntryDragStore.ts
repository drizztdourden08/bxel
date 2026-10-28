/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import type { EntryDragState } from './entry-drag-store.type';

const useEntryDragStore = create<EntryDragState>()((set) => ({
  active: null,
  begin: (state) => set({ active: state }),
  finish: () => set({ active: null }),
}));

export { useEntryDragStore };
