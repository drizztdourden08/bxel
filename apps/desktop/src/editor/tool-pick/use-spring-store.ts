/* @layer renderer-app @kind logic */
import { create } from 'zustand';
import type { ToolId } from '../tool.type';

interface SpringState {
  tool: ToolId | null;
  borrowed: ToolId | null;
  borrow: (home: ToolId | null, borrowed: ToolId | null) => void;
}

const useSpringStore = create<SpringState>()((set) => ({
  tool: null,
  borrowed: null,
  borrow: (tool, borrowed) => set({ tool, borrowed }),
}));

export { useSpringStore };
