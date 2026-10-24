/* @layer core @kind logic */
import type { AssetSlice } from '../../model/asset.type';
import { SPRITE_OWNERS } from './supplies-sprite.constants';

const suppliesSprite = (slices: readonly AssetSlice[], spriteId: string): boolean =>
  slices.some(
    (slice) => SPRITE_OWNERS.includes(slice.kind) && slice.artwork.sprites?.some((sprite) => sprite.id === spriteId) === true,
  );

export { suppliesSprite };
