/* @layer renderer-app @kind types */
import type { FrameId } from '@bxel/document';
import type { OnionTint } from '../stores/timeline-store.type';

type OnionSide = 'before' | 'after';

interface OnionLayer {
  frameId: FrameId;
  side: OnionSide;
  alpha: number;
}

type Rgb = readonly [number, number, number];

interface OnionGhost {
  frameId: FrameId;
  side: OnionSide;
  tint: OnionTint;
}

export type { OnionGhost, OnionLayer, OnionSide, Rgb };
