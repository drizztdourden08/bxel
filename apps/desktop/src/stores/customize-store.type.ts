/* @layer renderer-app @kind types */
interface CustomizeState {
  open: boolean;
  show: (open: boolean) => void;
}

export type { CustomizeState };
