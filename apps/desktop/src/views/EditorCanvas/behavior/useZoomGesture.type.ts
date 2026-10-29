/* @layer renderer-app @kind types */
interface ZoomPress {
  readonly startX: number;
  readonly startY: number;
  readonly startZoom: number;
  readonly rect: boolean;
  moved: boolean;
}

export type { ZoomPress };
