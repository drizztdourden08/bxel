/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import type { FaultStore } from './fault-store.type';

const useFaultStore = create<FaultStore>()((set) => ({
  fault: null,
  set: (fault) => set({ fault }),
}));

export { useFaultStore };
