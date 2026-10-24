/* @layer renderer-app @kind types */
import type { ExportOpen } from './export.type';

interface ExportState {
  open: boolean;
  running: boolean;
  request: ExportOpen | null;
  show: (request?: ExportOpen) => void;
  hide: () => void;
  setRunning: (running: boolean) => void;
}

export type { ExportState };
