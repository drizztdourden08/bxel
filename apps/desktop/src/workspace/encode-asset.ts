/* @layer renderer-app @kind logic */
import { sliceAsset } from '@bxel/document';
import type { Artwork, AssetKey } from '@bxel/document';
import type { Clock } from '@bxel/document/native';
import { ASSET_ENCODERS } from './workspace.constants';

const encodeAsset = (
  artwork: Artwork,
  key: AssetKey,
  paths: ReadonlyMap<string, string>,
  options: { readonly preview: Uint8Array | null; readonly clock: Clock },
): Uint8Array => {
  const encode = ASSET_ENCODERS[key.kind];
  if (!encode) throw new Error(`A ${key.kind} is not saved as its own file.`);
  return encode(sliceAsset(artwork, key, paths), options.preview, options.clock);
};

export { encodeAsset };
