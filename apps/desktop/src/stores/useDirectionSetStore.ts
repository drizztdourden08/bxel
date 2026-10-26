/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import type { DirectionSetState } from '../direction-set/direction-set.type';

const useDirectionSetStore = create<DirectionSetState>()((set) => ({
  open: false,
  show: () => set({ open: true }),
  hide: () => set({ open: false }),
}));

export { useDirectionSetStore };
