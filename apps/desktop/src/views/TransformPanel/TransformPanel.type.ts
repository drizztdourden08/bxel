/* @layer renderer-app @kind types */
interface TransformAction {
  id: string;
  label: string;
  shortcut: string | null;
  run: () => void;
}

export type { TransformAction };
