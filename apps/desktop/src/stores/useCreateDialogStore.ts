/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import type { CreationState } from './creation-store.type';

const useCreateDialogStore = create<CreationState>()((set) => ({
  mode: 'closed',
  show: (mode) => set({ mode }),
  hide: () => set({ mode: 'closed' }),
}));

export { useCreateDialogStore };
