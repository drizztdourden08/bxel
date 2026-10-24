/* @layer core @kind logic */
import { strToU8, zipSync } from 'fflate';
import type { Zippable } from 'fflate';
import { ASSET_FORMAT } from '../../model/asset-format.constants';
import { DEFLATE_LEVEL, ENTRY, STORED_LEVEL, ZIP_MTIME } from '../container.constants';
import { ASSET_DOCUMENT_ENTRY } from './asset-container.constants';
import type { AssetParts } from './asset-parts.type';
import { buildAssetManifest } from './build-asset-manifest';
import { canonicalJson } from './canonical-json';

const deflated = { level: DEFLATE_LEVEL } as const;
const stored = { level: STORED_LEVEL } as const;

const writeAssetContainer = (parts: AssetParts): Uint8Array => {
  const { kind } = parts.header;
  const files: Zippable = {
    [ENTRY.mimetype]: [strToU8(ASSET_FORMAT[kind].mime), stored],
    [ENTRY.manifest]: [strToU8(canonicalJson(buildAssetManifest(parts))), deflated],
    [ASSET_DOCUMENT_ENTRY[kind]]: [parts.documentBytes, deflated],
  };
  for (const [path, bytes] of parts.blobs) files[path] = [bytes, deflated];
  if (parts.preview) files[ENTRY.preview] = [parts.preview, stored];
  return zipSync(files, { mtime: ZIP_MTIME });
};

export { writeAssetContainer };
