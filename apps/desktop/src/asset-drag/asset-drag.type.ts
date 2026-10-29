/* @layer renderer-app @kind types */
import type { DragSource } from '../sheet-manager/drag-payload.type';

type DragAsset = {
  readonly id: string;
  readonly kind: string;
  readonly assetId: string | null;
  readonly path: string;
  readonly tagId?: string | null;
  readonly origin?: DragSource;
};

export type { DragAsset };
