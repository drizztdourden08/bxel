/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import type { AddFramesState } from '../add-frames/add-frames.type';

const useAddFramesStore = create<AddFramesState>()((set) => ({
  mode: null,
  show: (mode) => set({ mode }),
  hide: () => set({ mode: null }),
}));

export { useAddFramesStore };
