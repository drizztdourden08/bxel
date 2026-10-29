/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import type { LinkedPromptState } from './linked-prompt-store.type';

const useLinkedPromptStore = create<LinkedPromptState>()((set) => ({
  open: false,
  show: () => set({ open: true }),
  hide: () => set({ open: false }),
}));

export { useLinkedPromptStore };
