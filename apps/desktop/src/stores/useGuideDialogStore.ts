/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import type { GuideDialogState } from './guide-dialog-store.type';

const useGuideDialogStore = create<GuideDialogState>()((set) => ({
  open: false,
  axis: 'x',
  from: null,
  position: 0,
  show: ({ axis, from, position }) => set({ open: true, axis, from, position }),
  hide: () => set({ open: false }),
}));

export { useGuideDialogStore };
