/* @layer core @kind logic */
import type { Artwork } from '../model/artwork.type';
import type { AssetSlice } from '../model/asset.type';
import type { AssetKey } from './asset-key.type';
import type { AssetPaths } from './asset-paths.type';
import { SLICE_BUILDERS } from './slice-builders.constants';
import { tileOwners } from './tile-owners';

const sliceAsset = (artwork: Artwork, key: AssetKey, paths: AssetPaths): AssetSlice => {
  const build = SLICE_BUILDERS[key.kind];
  if (!build) throw new Error(`A ${key.kind} is not an asset slice.`);
  return build({ artwork, paths, owners: tileOwners(artwork), own: paths.get(key.id) ?? '' }, key.id);
};

export { sliceAsset };
