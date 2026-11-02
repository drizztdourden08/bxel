/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import type { OnionPatternState } from './onion-pattern-store.type';

const useOnionPatternStore = create<OnionPatternState>()((set) => ({
  pattern: 'none',
  setPattern: (pattern) => set({ pattern }),
}));

export { useOnionPatternStore };
