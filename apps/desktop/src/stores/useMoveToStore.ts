/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import type { MoveToState } from './move-to-store.type';

const useMoveToStore = create<MoveToState>()((set) => ({
  request: null,
  show: (request) => set({ request }),
  hide: () => set({ request: null }),
}));

export { useMoveToStore };
