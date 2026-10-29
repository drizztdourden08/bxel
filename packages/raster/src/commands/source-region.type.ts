/* @layer core @kind types */
import type { Sprite } from '@bxel/document';
import type { MaskView } from '../buffer.type';
import type { Rect } from '../geometry.type';

interface SourceRegion {
  sprite: Sprite;
  pixels: Uint8Array;
  mask: MaskView | undefined;
  rect: Rect;
}

interface SourceRequest {
  sprite: string;
  frame: string;
  layer: string;
  rect: Rect;
  mask?: MaskView | undefined;
}

export type { SourceRegion, SourceRequest };
