/* @layer renderer-app @kind logic */
import type { Artwork, Sprite } from '@bxel/document';
import type { EffectivePlatform } from './platform-preset.type';

const effectivePlatform = (artwork: Artwork, sprite: Sprite | undefined): EffectivePlatform => {
  const own = sprite?.platformId;
  const platformId = own ?? artwork.platformId;
  const inherits = own === undefined;
  const strict = sprite?.platformStrict ?? (inherits && artwork.platformStrict === true);
  return { platformId, strict: platformId !== undefined && strict, inherited: inherits };
};

export { effectivePlatform };
