/* @layer core @kind logic */
import { ASSET_KIND } from '../../model/asset-format.constants';
import type { AssetSlice } from '../../model/asset.type';

const suppliesAnimation = (slices: readonly AssetSlice[], animationId: string): boolean =>
  slices.some(
    (slice) =>
      slice.kind === ASSET_KIND.animation && slice.artwork.animations?.some((animation) => animation.id === animationId) === true,
  );

export { suppliesAnimation };
