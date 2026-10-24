/* @layer core @kind types */
import type { Artwork, SpriteId } from '@bxel/document';
import type { MaskView } from '../buffer.type';

type TargetRules = {
  readonly artwork: Artwork;
  readonly sprites: readonly SpriteId[];
  readonly index: number;
  readonly mask: MaskView | undefined;
};

export type { TargetRules };
