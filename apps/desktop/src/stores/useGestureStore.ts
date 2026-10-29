/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import type { GestureState } from './gesture-store.type';

const useGestureStore = create<GestureState>()((set) => ({
  hint: '',
  setHint: (hint) => set((state) => (state.hint === hint ? state : { hint })),
}));

export { useGestureStore };
