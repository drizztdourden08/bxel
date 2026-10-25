/* @layer core @kind logic */
import type { AssetSlice } from '../../model/asset.type';
import { ASSET_CHECKS } from './asset-checks.constants';

const checkAssetSlice = (slice: AssetSlice): void => {
  ASSET_CHECKS[slice.kind]?.(slice);
};

export { checkAssetSlice };
