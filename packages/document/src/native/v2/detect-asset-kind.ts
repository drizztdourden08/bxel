/* @layer core @kind logic */
import { strFromU8, unzipSync } from 'fflate';
import { ASSET_FORMAT, LEGACY_FORMAT } from '../../model/asset-format.constants';
import { ENTRY } from '../container.constants';
import type { AssetDetection, DetectedKind } from './detected-kind.type';
import { mimeKind } from './mime-kind';

const mimetypeOf = (bytes: Uint8Array): string | null => {
  try {
    const found = unzipSync(bytes, { filter: (file) => file.name === ENTRY.mimetype })[ENTRY.mimetype];
    return found ? strFromU8(found) : null;
  } catch {
    return null;
  }
};

const extensionOf = (kind: DetectedKind): string =>
  kind === 'legacy' ? LEGACY_FORMAT.extension : ASSET_FORMAT[kind].extension;

const detectAssetKind = (bytes: Uint8Array, fileName: string | null = null): AssetDetection | null => {
  const mime = mimetypeOf(bytes);
  const kind = mime === null ? null : mimeKind(mime);
  if (kind === null) return null;
  const extensionMatches = fileName === null ? null : fileName.toLowerCase().endsWith(extensionOf(kind));
  return { kind, extensionMatches };
};

export { detectAssetKind };
