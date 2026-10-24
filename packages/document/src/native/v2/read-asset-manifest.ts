/* @layer core @kind logic */
import { strFromU8, unzipSync } from 'fflate';
import { assetManifestSchema } from '../../schema/asset-manifest-schema';
import { ENTRY } from '../container.constants';
import type { AssetManifest } from './asset-manifest.type';

const manifestBytes = (bytes: Uint8Array): Uint8Array | undefined =>
  unzipSync(bytes, { filter: (file) => file.name === ENTRY.manifest })[ENTRY.manifest];

const readAssetManifest = (bytes: Uint8Array): AssetManifest | null => {
  try {
    const raw = manifestBytes(bytes);
    const parsed = raw ? assetManifestSchema.safeParse(JSON.parse(strFromU8(raw))) : null;
    return parsed?.success ? parsed.data : null;
  } catch {
    return null;
  }
};

export { readAssetManifest };
