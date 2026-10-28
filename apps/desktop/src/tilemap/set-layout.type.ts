/* @layer renderer-app @kind types */
interface LayoutPatch {
  columns?: number;
  move?: readonly { key: number; to: number }[];
}

export type { LayoutPatch };
