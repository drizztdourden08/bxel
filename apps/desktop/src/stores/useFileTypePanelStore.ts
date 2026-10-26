/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import type { FileTypePanelState } from './file-type-panel.type';

const useFileTypePanelStore = create<FileTypePanelState>()((set) => ({
  open: false,
  show: () => set({ open: true }),
  hide: () => set({ open: false }),
}));

export { useFileTypePanelStore };
