/* @layer renderer-app @kind types */
type DragAsset = {
  readonly id: string;
  readonly kind: string;
  readonly assetId: string | null;
  readonly path: string;
};

export type { DragAsset };
