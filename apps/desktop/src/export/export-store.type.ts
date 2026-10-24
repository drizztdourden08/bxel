/* @layer renderer-app @kind types */
interface ExportState {
  open: boolean;
  running: boolean;
  show: () => void;
  hide: () => void;
  setRunning: (running: boolean) => void;
}

export type { ExportState };
