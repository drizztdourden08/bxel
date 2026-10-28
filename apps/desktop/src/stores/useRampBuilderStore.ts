/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import type { RampBuilderState } from './palette-panel-store.type';

const useRampBuilderStore = create<RampBuilderState>()((set) => ({
  request: null,
  open: (request) => set({ request }),
  close: () => set({ request: null }),
}));

export { useRampBuilderStore };
