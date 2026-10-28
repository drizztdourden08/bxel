/* @layer renderer-app @kind types */
type RunsReply = {
  readonly empty: boolean;
  readonly bounds: { readonly x: number; readonly y: number; readonly width: number; readonly height: number } | null;
  readonly pixels: number;
  readonly runs: [number, number, number][] | null;
};

export type { RunsReply };
