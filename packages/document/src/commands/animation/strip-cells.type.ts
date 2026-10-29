/* @layer core @kind types */
type StripLayout = {
  readonly columns: number;
  readonly rows: number;
  readonly cellWidth: number;
  readonly cellHeight: number;
};

type StripSize = {
  readonly name: string;
  readonly width: number;
  readonly height: number;
};

export type { StripLayout, StripSize };
