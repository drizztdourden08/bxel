/* @layer renderer-app @kind types */
import type { PaletteBank, Sprite } from '@bxel/document';
import type { FrameImage } from '../../../sheet/sheet.type';

interface AnimationClip {
  images: readonly FrameImage[];
  durations: readonly number[];
}

interface Held {
  sprites: readonly Sprite[];
  banks: readonly PaletteBank[];
  clips: Map<string, AnimationClip>;
}

export type { AnimationClip, Held };
