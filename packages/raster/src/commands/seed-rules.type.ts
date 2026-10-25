/* @layer core @kind types */
import type { Artwork, SpriteId } from '@bxel/document';
import type { Point } from '../geometry.type';
import type { Wrap } from '../wrap.type';

type SeedRules = {
  readonly artwork: Artwork;
  readonly sprites: readonly SpriteId[];
  readonly seed: Point;
  readonly wrap?: Wrap;
};

export type { SeedRules };
