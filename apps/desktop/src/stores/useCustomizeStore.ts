/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import type { CustomizeState } from './customize-store.type';

const useCustomizeStore = create<CustomizeState>()((set) => ({
  open: false,
  show: (open) => set({ open }),
}));

export { useCustomizeStore };
