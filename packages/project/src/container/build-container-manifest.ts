/* @layer core @kind logic */
import type { AssetManifest } from '@bxel/document/native';
import { entryOf } from './entry-of';
import type { ManifestParts } from './project-file.type';
import {
  CONTAINER_ENTRY,
  CONTAINER_FORMAT,
  CONTAINER_MIN_READER,
  CONTAINER_VERSION,
  CONTAINER_WRITER,
} from './project-container.constants';

const savedAtOf = (milliseconds: number): string => new Date(milliseconds).toISOString().replace(/\.\d{3}Z$/, 'Z');

const buildContainerManifest = ({ project, savedAt, documentBytes, preview, assets }: ManifestParts): AssetManifest => ({
  format: CONTAINER_FORMAT,
  kind: 'project',
  formatVersion: CONTAINER_VERSION,
  minReaderVersion: CONTAINER_MIN_READER,
  writer: CONTAINER_WRITER,
  savedAt: savedAtOf(savedAt),
  assetId: project.projectId,
  name: project.name,
  document: CONTAINER_ENTRY.document,
  preview: preview ? CONTAINER_ENTRY.preview : null,
  links: [],
  entries: [
    entryOf(CONTAINER_ENTRY.document, documentBytes),
    ...[...assets].sort(([left], [right]) => (left < right ? -1 : 1)).map(([path, bytes]) => entryOf(path, bytes)),
    ...(preview ? [entryOf(CONTAINER_ENTRY.preview, preview)] : []),
  ],
});

export { buildContainerManifest };
