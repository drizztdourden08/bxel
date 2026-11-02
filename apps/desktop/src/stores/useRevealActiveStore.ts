/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import type { RevealActiveState } from './reveal-active-store.type';

const useRevealActiveStore = create<RevealActiveState>()((set, get) => ({
  pending: false,
  ask: () => set({ pending: true }),
  take: () => {
    const { pending } = get();
    if (pending) set({ pending: false });
    return pending;
  },
}));

export { useRevealActiveStore };
