/* @layer renderer-app @kind types */
type DemoCopyOutcome =
  | { readonly ok: true; readonly path: string; readonly reused: boolean }
  | { readonly ok: false; readonly message: string };

export type { DemoCopyOutcome };
