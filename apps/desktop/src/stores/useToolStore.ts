/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import { TOOL_DEFAULTS } from './tool-store.constants';
import type { ToolState } from './tool-store.type';

const useToolStore = create<ToolState>()((set) => ({
  ...TOOL_DEFAULTS,
  setTool: (tool) => set({ tool }),
  setForeground: (foreground) => set({ foreground }),
  setBackground: (background) => set({ background }),
  swapColors: () => set((state) => ({ foreground: state.background, background: state.foreground })),
}));

export { useToolStore };
