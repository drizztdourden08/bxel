/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import type { ChangeState } from './change-store.type';

const useChangeStore = create<ChangeState>()((set) => ({
  request: null,
  propose: (request) => set({ request }),
  setOther: (other) => set((state) => (state.request ? { request: { ...state.request, other } } : state)),
  setCap: (cap) => set((state) => (state.request ? { request: { ...state.request, cap } } : state)),
  hide: () => set({ request: null }),
}));

export { useChangeStore };
