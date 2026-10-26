/* @layer core @kind logic */
import { ENTRY, FORMAT_NAME, WRITER } from '../container.constants';
import { entryOf } from '../entry-of';
import { savedAtOf } from '../saved-at-of';
import { ASSET_DOCUMENT_ENTRY, ASSET_MIN_READER_VERSION } from './asset-container.constants';
import type { AssetManifest } from './asset-manifest.type';
import type { AssetParts } from './asset-parts.type';

const buildAssetManifest = ({ header, savedAt, readerVersion, documentBytes, preview, blobs }: AssetParts): AssetManifest => {
  const document = ASSET_DOCUMENT_ENTRY[header.kind];
  return {
    format: FORMAT_NAME,
    kind: header.kind,
    formatVersion: readerVersion ?? ASSET_MIN_READER_VERSION,
    minReaderVersion: readerVersion ?? ASSET_MIN_READER_VERSION,
    writer: WRITER,
    savedAt: savedAtOf(savedAt),
    assetId: header.id,
    name: header.name,
    document,
    preview: preview ? ENTRY.preview : null,
    links: header.links,
    entries: [
      entryOf(document, documentBytes),
      ...[...blobs].map(([path, bytes]) => entryOf(path, bytes)),
      ...(preview ? [entryOf(ENTRY.preview, preview)] : []),
    ],
  };
};

export { buildAssetManifest };
