/* @layer renderer-app @kind types */
import type { AnimFlip, AnimFrameId, Animation, Artwork, PaletteBank } from '@bxel/document';
import type { OnionStyle, OnionTint } from '../stores/timeline-store.type';

type OnionSide = 'before' | 'after';

type OnionPattern = 'none' | 'dots' | 'lines' | 'split';

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
  colour: string;
  style: OnionStyle;
  behind: boolean;
  pattern?: OnionPattern;
}

type OnionSource = { readonly artwork: Artwork; readonly animation: Animation; readonly bank: PaletteBank };

interface OnionStep {
  frameId: AnimFrameId;
  flip: AnimFlip | null;
}

export type { OnionGhost, OnionLayer, OnionPattern, OnionSide, OnionSource, OnionStep, Rgb };
