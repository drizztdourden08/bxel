/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import type { AddFramesState } from '../add-frames/add-frames.type';

const useAddFramesStore = create<AddFramesState>()((set) => ({
  mode: null,
  file: null,
  show: (mode, file) => set({ mode, file: file ?? null }),
  hide: () => set({ mode: null, file: null }),
}));

export { useAddFramesStore };
