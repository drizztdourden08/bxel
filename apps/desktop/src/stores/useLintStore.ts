/* @layer renderer-app @kind hook */
import { create } from 'zustand';

interface LintState {
  shown: boolean;
  setShown: (shown: boolean) => void;
}

const useLintStore = create<LintState>()((set) => ({
  shown: false,
  setShown: (shown) => set({ shown }),
}));

export { useLintStore };
export type { LintState };
