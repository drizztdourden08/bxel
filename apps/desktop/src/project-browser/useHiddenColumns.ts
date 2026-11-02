/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import type { HiddenColumnsState } from './hidden-columns.type';

const useHiddenColumns = create<HiddenColumnsState>()((set) => ({
  hidden: [],
  toggle: (column) => set((state) => ({ hidden: state.hidden.includes(column) ? state.hidden.filter((each) => each !== column) : [...state.hidden, column] })),
}));

export { useHiddenColumns };
