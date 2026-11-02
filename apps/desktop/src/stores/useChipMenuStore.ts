/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import type { ChipMenuState } from './chip-menu-store.type';

const useChipMenuStore = create<ChipMenuState>()((set) => ({
  everyTool: false,
  setEveryTool: (everyTool) => set({ everyTool }),
}));

export { useChipMenuStore };
