/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import type { ManyStoreState } from './many-subject.type';

const useManyStore = create<ManyStoreState>()((set) => ({
  many: null,
  show: (many) => set({ many }),
  clear: () => set({ many: null }),
}));

export { useManyStore };
