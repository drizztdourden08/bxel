/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import type { CanvasSizeState } from './canvas-size-store.type';

const useCanvasSizeStore = create<CanvasSizeState>()((set) => ({
  open: false,
  show: () => set({ open: true }),
  hide: () => set({ open: false }),
}));

export { useCanvasSizeStore };
