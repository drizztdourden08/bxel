/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import type { HealthStore } from './health-store.type';

const useHealthStore = create<HealthStore>()((set) => ({
  state: { status: 'idle' },
  repaired: [],
  rekeyed: [],
  set: (state) => set({ state }),
  setRepaired: (repaired) => set({ repaired }),
  setRekeyed: (rekeyed) => set({ rekeyed }),
}));

export { useHealthStore };
