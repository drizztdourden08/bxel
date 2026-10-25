/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import type { AnnounceState } from './announce-store.type';

const useAnnounceStore = create<AnnounceState>()((set) => ({
  announcement: null,
  say: (text) => set((state) => ({ announcement: { id: (state.announcement?.id ?? 0) + 1, text } })),
}));

export { useAnnounceStore };
