/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import type { SelectionNamesState } from './selection-names-store.type';

const useSelectionNamesStore = create<SelectionNamesState>()((set) => ({
  open: false,
  show: () => set({ open: true }),
  hide: () => set({ open: false }),
}));

export { useSelectionNamesStore };
