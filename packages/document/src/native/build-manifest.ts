/* @layer core @kind logic */
import type { ContainerParts } from './container-parts.type';
import {
  ENTRY,
  FORMAT_NAME,
  FORMAT_VERSION,
  MIN_READER_VERSION,
  WRITER,
} from './container.constants';
import { crc32 } from './crc32';
import type { Manifest, ManifestEntry } from './manifest.type';

const entryOf = (path: string, bytes: Uint8Array): ManifestEntry => ({
  path,
  length: bytes.length,
  crc32: crc32(bytes),
});

const savedAtOf = (milliseconds: number): string => new Date(milliseconds).toISOString().replace(/\.\d{3}Z$/, 'Z');

const buildManifest = ({ project, savedAt, documentBytes, preview, blobs }: ContainerParts): Manifest => ({
  format: FORMAT_NAME,
  formatVersion: FORMAT_VERSION,
  minReaderVersion: MIN_READER_VERSION,
  writer: WRITER,
  savedAt: savedAtOf(savedAt),
  projectId: project.id,
  document: ENTRY.document,
  preview: preview ? ENTRY.preview : null,
  entries: [
    entryOf(ENTRY.document, documentBytes),
    ...[...blobs].map(([path, bytes]) => entryOf(path, bytes)),
    ...(preview ? [entryOf(ENTRY.preview, preview)] : []),
  ],
});

export { buildManifest };
