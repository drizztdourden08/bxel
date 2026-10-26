/* @layer core @kind types */
import type { Animation } from '../../model/animation.type';
import type { Artwork } from '../../model/artwork.type';
import type { Sprite } from '../../model/sprite.type';
import type { AssetPaths } from '../asset-paths.type';

type AnimatedConversion = {
  readonly source: 'sprite' | 'tile';
  readonly spriteId: string;
  readonly spriteName: string;
  readonly spritePath: string | null;
  readonly animationId: string;
  readonly animationName: string;
  readonly animationPath: string;
  readonly frames: number;
};

type AnimatedSplit = {
  readonly artwork: Artwork;
  readonly paths: AssetPaths;
  readonly conversions: readonly AnimatedConversion[];
  readonly trashed: readonly string[];
  readonly notice: string | null;
};

type BuiltAnimation = {
  readonly animation: Animation;
  readonly sprites: readonly Sprite[];
};

type Naming = { readonly animation: string; readonly taken: readonly string[] };

type SplitState = {
  artwork: Artwork;
  readonly paths: Map<string, string>;
  readonly conversions: AnimatedConversion[];
  readonly trashed: string[];
};

export type { AnimatedConversion, AnimatedSplit, BuiltAnimation, Naming, SplitState };
