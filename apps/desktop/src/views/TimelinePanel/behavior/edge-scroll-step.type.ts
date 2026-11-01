/* @layer renderer-app @kind types */
interface Pointer {
  x: number;
  y: number;
}

interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type { Bounds, Pointer };
