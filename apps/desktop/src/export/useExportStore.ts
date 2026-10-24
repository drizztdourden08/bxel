/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import type { ExportState } from './export-store.type';

const useExportStore = create<ExportState>()((set) => ({
  open: false,
  running: false,
  show: () => set({ open: true }),
  hide: () => set({ open: false }),
  setRunning: (running) => set({ running }),
}));

export { useExportStore };
