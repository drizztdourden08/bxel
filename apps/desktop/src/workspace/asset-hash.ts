/* @layer renderer-app @kind logic */
import { sliceAsset } from '@bxel/document';
import type { Artwork, AssetKey } from '@bxel/document';
import { assetDigest } from '@bxel/document/native';

const assetHash = (artwork: Artwork, key: AssetKey, paths: ReadonlyMap<string, string>): string | null => {
  try {
    return assetDigest(sliceAsset(artwork, key, paths));
  } catch {
    return null;
  }
};

export { assetHash };
