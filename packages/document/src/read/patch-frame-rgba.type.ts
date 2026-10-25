/* @layer core @kind types */
type FramePatch = {
  readonly words: Uint32Array;
  readonly cels: readonly Uint8Array[];
  readonly table: Uint32Array;
  readonly width: number;
};

export type { FramePatch };
