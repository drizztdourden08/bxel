/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import type { TransformUiState } from './transform-ui-store.type';

const useTransformUiStore = create<TransformUiState>()((set) => ({
  focus: null,
  grab: null,
  setFocus: (focus) => set({ focus }),
  setGrab: (grab) => set({ grab }),
}));

export { useTransformUiStore };
