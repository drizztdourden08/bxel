/* @layer core @kind types */
type DiffPair = {
  readonly before: Uint8Array;
  readonly after: Uint8Array;
  readonly beforeWords: Uint32Array | null;
  readonly afterWords: Uint32Array | null;
};

export type { DiffPair };
