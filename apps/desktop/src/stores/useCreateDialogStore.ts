/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import type { CreationState } from './creation-store.type';

const useCreateDialogStore = create<CreationState>()((set) => ({
  mode: 'closed',
  kind: null,
  show: (mode, kind) => set({ mode, kind: kind ?? null }),
  hide: () => set({ mode: 'closed', kind: null }),
}));

export { useCreateDialogStore };
