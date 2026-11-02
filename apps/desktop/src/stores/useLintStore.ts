/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import type { LintState } from './lint-store.type';

const useLintStore = create<LintState>()((set) => ({
  shown: false,
  setShown: (shown) => set({ shown }),
}));

export { useLintStore };
