/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import type { BankPreviewState } from './palette-panel-store.type';

const usePreviewBankStore = create<BankPreviewState>()((set) => ({
  preview: null,
  show: (preview) => set({ preview }),
  end: () => set({ preview: null }),
}));

export { usePreviewBankStore };
