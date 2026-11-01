/* @layer renderer-app @kind logic */
import { create } from 'zustand';
import type { SpringState } from './useSpringStore.type';

const useSpringStore = create<SpringState>()((set) => ({
  tool: null,
  borrowed: null,
  borrow: (tool, borrowed) => set({ tool, borrowed }),
}));

export { useSpringStore };
