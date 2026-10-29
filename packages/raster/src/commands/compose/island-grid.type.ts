/* @layer core @kind types */
type IslandGrid = {
  readonly mask: Uint8Array;
  readonly seen: Uint8Array;
  readonly width: number;
  readonly height: number;
};

export type { IslandGrid };
