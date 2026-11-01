/* @layer renderer-app @kind types */
import type { SpriteId } from '@bxel/document';
import type { DroppedFiles } from '@drizztdourden08/brock-react';
import type { DragAsset } from '../asset-drag/asset-drag.type';

type CanvasDropPayload = DroppedFiles | readonly DragAsset[];

type CanvasDropTarget = {
  readonly spriteId: SpriteId | null;
  readonly readOnly: boolean;
};

export type { CanvasDropPayload, CanvasDropTarget };
