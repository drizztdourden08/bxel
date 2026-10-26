/* @layer renderer-app @kind types */
import type { AnimFlip, AnimFrameId } from '@bxel/document';
import type { OnionTint } from '../stores/timeline-store.type';

type OnionSide = 'before' | 'after';

interface OnionLayer {
  frameId: AnimFrameId;
  flip: AnimFlip | null;
  side: OnionSide;
  alpha: number;
}

type Rgb = readonly [number, number, number];

interface OnionGhost {
  frameId: AnimFrameId;
  flip: AnimFlip | null;
  side: OnionSide;
  tint: OnionTint;
}

export type { OnionGhost, OnionLayer, OnionSide, Rgb };
