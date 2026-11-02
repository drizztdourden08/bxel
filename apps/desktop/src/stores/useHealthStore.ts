/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import type { HealthStore } from './health-store.type';

const useHealthStore = create<HealthStore>()((set) => ({
  state: { status: 'idle' },
  repaired: [],
  set: (state) => set({ state }),
  setRepaired: (repaired) => set({ repaired }),
}));

export { useHealthStore };
