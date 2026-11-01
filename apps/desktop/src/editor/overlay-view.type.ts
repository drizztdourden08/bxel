/* @layer renderer-app @kind types */
interface OverlayView {
  readonly alpha: number;
  readonly below: Uint8Array;
  readonly above: Uint8Array;
  readonly committed: Uint8Array;
}

export type { OverlayView };
