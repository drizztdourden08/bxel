/* @layer renderer-app @kind types */
interface StatusExtras {
  index: { text: string; swatch?: string } | null;
  selection: string | null;
  drag: string | null;
  frame: string | null;
  cell: string | null;
  tile: string | null;
}

export type { StatusExtras };
