/* @layer renderer-app @kind types */
type WaterOptions = {
  readonly side: number;
  readonly frameMs: number;
  readonly indexes: readonly [number, number];
  readonly columns: number;
  readonly rows: number;
};

export type { WaterOptions };
