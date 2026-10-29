/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import type { HealthStore } from './health-store.type';

const useHealthStore = create<HealthStore>()((set) => ({
  state: { status: 'idle' },
  set: (state) => set({ state }),
}));

export { useHealthStore };
