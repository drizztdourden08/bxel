/* @layer renderer-app @kind logic */
import type { Artwork, AssetKey } from '@bxel/document';
import { crc32 } from '@bxel/document/native';
import { encodeAsset } from './encode-asset';
import { HASH_CLOCK } from './workspace.constants';

const assetHash = (artwork: Artwork, key: AssetKey, paths: ReadonlyMap<string, string>): string | null => {
  try {
    const bytes = encodeAsset(artwork, key, paths, { preview: null, clock: HASH_CLOCK });
    return `${bytes.length}:${crc32(bytes)}`;
  } catch {
    return null;
  }
};

export { assetHash };
