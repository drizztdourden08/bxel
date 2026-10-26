/* @layer renderer-app @kind types */
import type { AnimFlip, AnimFrameId, Animation, Artwork, PaletteBank } from '@bxel/document';
import type { OnionSettings, OnionTint } from '../stores/timeline-store.type';

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

type OnionSource = { readonly artwork: Artwork; readonly animation: Animation; readonly bank: PaletteBank };

type OnionAround = { readonly onion: OnionSettings; readonly shown: AnimFrameId };

export type { OnionAround, OnionGhost, OnionLayer, OnionSide, OnionSource, Rgb };
