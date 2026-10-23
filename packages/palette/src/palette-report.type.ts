/* @layer core @kind types */
type ReportOptions = {
  readonly palette: readonly string[];
  readonly transparent: boolean;
  readonly usage: Uint32Array;
};

type PaletteReport = {
  readonly used: readonly number[];
  readonly unused: readonly number[];
  readonly duplicates: readonly (readonly number[])[];
  readonly outOfRange: number;
};

export type { PaletteReport, ReportOptions };
