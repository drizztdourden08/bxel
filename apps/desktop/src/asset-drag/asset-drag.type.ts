/* @layer renderer-app @kind types */
type DragAsset = {
  readonly kind: string;
  readonly assetId: string | null;
  readonly path: string;
};

export type { DragAsset };
