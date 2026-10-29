/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import type { PasteChoiceState } from './paste-choice-store.type';

const usePasteChoiceStore = create<PasteChoiceState>()((set) => ({
  open: false,
  show: () => set({ open: true }),
  hide: () => set({ open: false }),
}));

export { usePasteChoiceStore };
