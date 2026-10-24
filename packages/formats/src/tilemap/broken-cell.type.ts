/* @layer core @kind types */
type BrokenCell = {
  readonly layer: string;
  readonly x: number;
  readonly y: number;
  readonly key: number;
  readonly reserved: boolean;
};

export type { BrokenCell };
