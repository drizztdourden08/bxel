/* @layer core @kind logic */
import type { Sprite } from '../../model/sprite.type';
import type { PlatformOptions } from './sprite-platform.type';

const spritePlatform = (sprite: Sprite, options: PlatformOptions): Pick<Sprite, 'platformId' | 'platformStrict'> => {
  const platformId = options.platformId === undefined ? sprite.platformId : (options.platformId ?? undefined);
  const kept = options.platformId === null ? undefined : sprite.platformStrict;
  return { platformId, platformStrict: options.platformStrict ?? kept };
};

export { spritePlatform };
