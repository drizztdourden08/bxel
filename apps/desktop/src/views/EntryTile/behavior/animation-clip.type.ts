/* @layer renderer-app @kind types */
import type { PixelThumbnailFrame } from '@drizztdourden08/tessera';
import type { PaletteBank, Sprite } from '@bxel/document';

type AnimationClip = readonly PixelThumbnailFrame[];

interface Held {
  sprites: readonly Sprite[];
  banks: readonly PaletteBank[];
  clips: Map<string, AnimationClip>;
}

export type { AnimationClip, Held };
