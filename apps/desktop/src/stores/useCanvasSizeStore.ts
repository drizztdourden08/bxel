/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import type { CanvasSizeState } from './canvas-size-store.type';

const useCanvasSizeStore = create<CanvasSizeState>()((set) => ({
  open: false,
  preview: null,
  setPreview: (preview) => set({ preview }),
  show: () => set({ open: true }),
  hide: () => set({ open: false, preview: null }),
}));

export { useCanvasSizeStore };
