/* @layer renderer-app @kind types */
type ViewMetrics = {
  readonly width: number;
  readonly height: number;
  readonly zoom: number;
  readonly pan: { readonly x: number; readonly y: number };
  readonly imageWidth: number;
  readonly imageHeight: number;
};

export type { ViewMetrics };
