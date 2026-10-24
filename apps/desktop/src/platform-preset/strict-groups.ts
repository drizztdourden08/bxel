/* @layer renderer-app @kind logic */
import type { Artwork, Sprite } from '@bxel/document';
import { listSprites } from '../sheet/list-sprites';
import { effectivePlatform } from './effective-platform';
import type { StrictGroup } from './strict-break.type';

const strictGroups = (artwork: Artwork): StrictGroup[] => {
  const sprites = listSprites(artwork);
  const byPlatform = new Map<string, Sprite[]>();
  for (const sprite of sprites) {
    const { platformId, strict } = effectivePlatform(artwork, sprite);
    if (platformId !== undefined && strict) byPlatform.set(platformId, [...(byPlatform.get(platformId) ?? []), sprite]);
  }
  const groups = [...byPlatform].map(([platformId, members]) => ({ platformId, sprites: members, whole: members.length === sprites.length }));
  const bare = sprites.length === 0 && artwork.platformStrict === true && artwork.platformId !== undefined;
  return bare ? [...groups, { platformId: artwork.platformId ?? '', sprites: [], whole: true }] : groups;
};

export { strictGroups };
