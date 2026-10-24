/* @layer core @kind logic */
import type { ContainerParts } from './container-parts.type';
import {
  ENTRY,
  FORMAT_NAME,
  FORMAT_VERSION,
  MIN_READER_VERSION,
  WRITER,
} from './container.constants';
import { entryOf } from './entry-of';
import type { Manifest } from './manifest.type';
import { savedAtOf } from './saved-at-of';

const buildManifest = ({ artwork, savedAt, documentBytes, preview, blobs }: ContainerParts): Manifest => ({
  format: FORMAT_NAME,
  formatVersion: FORMAT_VERSION,
  minReaderVersion: MIN_READER_VERSION,
  writer: WRITER,
  savedAt: savedAtOf(savedAt),
  artworkId: artwork.id,
  document: ENTRY.document,
  preview: preview ? ENTRY.preview : null,
  entries: [
    entryOf(ENTRY.document, documentBytes),
    ...[...blobs].map(([path, bytes]) => entryOf(path, bytes)),
    ...(preview ? [entryOf(ENTRY.preview, preview)] : []),
  ],
});

export { buildManifest };
