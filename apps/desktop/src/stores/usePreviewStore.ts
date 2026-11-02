/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import { PREVIEW_DEFAULTS } from './preview-store.constants';
import type { PreviewState } from './preview-store.type';

const usePreviewStore = create<PreviewState>()((set) => ({
  ...PREVIEW_DEFAULTS,
  toggle: () => set((state) => ({ shown: !state.shown })),
  setScale: (scale) => set({ scale }),
  setOnCanvas: (onCanvas) => set({ onCanvas }),
}));

export { usePreviewStore };
