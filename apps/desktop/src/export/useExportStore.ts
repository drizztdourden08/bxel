/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import type { ExportState } from './export-store.type';

const useExportStore = create<ExportState>()((set) => ({
  open: false,
  running: false,
  request: null,
  show: (request) => set({ open: true, request: request ?? null }),
  hide: () => set({ open: false, request: null }),
  setRunning: (running) => set({ running }),
}));

export { useExportStore };
