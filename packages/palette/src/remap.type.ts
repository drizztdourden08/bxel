/* @layer core @kind types */
type ReorderTables = {
  readonly forward: Uint8Array;
  readonly inverse: Uint8Array;
};

type RemoveSpec = {
  readonly slotCount: number;
  readonly removed: number;
  readonly replacement: number;
};

export type { RemoveSpec, ReorderTables };
