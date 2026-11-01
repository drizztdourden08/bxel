/* @layer renderer-app @kind types */
import type { AnimFrame, Layer, Sprite } from '@bxel/document';

interface CelsTarget {
  readonly sprite: Pick<Sprite, 'id'>;
  readonly layer: Pick<Layer, 'name'>;
  readonly animation?: { readonly animation: { readonly frames: readonly Pick<AnimFrame, 'id' | 'spriteId'>[] } };
}

interface CelsArtwork {
  readonly sprites: readonly (Pick<Sprite, 'id'> & { readonly layers: readonly Pick<Layer, 'name'>[] })[];
}

export type { CelsArtwork, CelsTarget };
