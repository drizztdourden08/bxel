/* @layer core @kind types */
import type { Artwork, SpriteId } from '@bxel/document';

type RampRequest = {
  readonly artwork: Artwork;
  readonly sprites: readonly SpriteId[];
  readonly name: string;
  readonly needs: number;
};

export type { RampRequest };
