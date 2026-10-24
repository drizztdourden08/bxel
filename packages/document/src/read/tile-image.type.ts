/* @layer core @kind types */
type TileImage = {
  readonly key: number;
  readonly width: number;
  readonly height: number;
  readonly rgba: Uint8Array;
};

export type { TileImage };
