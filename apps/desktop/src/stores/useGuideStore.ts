/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import type { GuideState } from './guide-store.type';

const useGuideStore = create<GuideState>()((set) => ({
  drag: null,
  setDrag: (drag) => set({ drag }),
}));

export { useGuideStore };
