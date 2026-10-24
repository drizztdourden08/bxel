/* @layer core @kind logic */
import { strToU8 } from 'fflate';
import type { AssetSlice } from '../../model/asset.type';
import { crc32 } from '../crc32';
import { ASSET_PARTS, DIGEST_CLOCK } from './asset-digest.constants';
import { buildAssetManifest } from './build-asset-manifest';
import { canonicalJson } from './canonical-json';

const assetDigest = (slice: AssetSlice): string => {
  const build = ASSET_PARTS[slice.kind];
  if (!build) throw new Error(`A ${slice.kind} has no asset file.`);
  const manifest = strToU8(canonicalJson(buildAssetManifest(build(slice, null, DIGEST_CLOCK))));
  return `${manifest.length}:${crc32(manifest)}`;
};

export { assetDigest };
