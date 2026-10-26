/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import type { CreationState } from './creation-store.type';

const useCreateDialogStore = create<CreationState>()((set) => ({
  mode: 'closed',
  kind: null,
  dir: null,
  show: (mode, kind, dir) => set({ mode, kind: kind ?? null, dir: dir ?? null }),
  hide: () => set({ mode: 'closed', kind: null, dir: null }),
}));

export { useCreateDialogStore };
