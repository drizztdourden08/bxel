/* @layer core @kind logic */
import { ASSET_FORMAT } from '@bxel/document';
import { strToU8 } from 'fflate';
import type { Zippable } from 'fflate';
import { buildContainerManifest } from './build-container-manifest';
import { CONTAINER_ENTRY, DEFLATE_LEVEL, JSON_INDENT, STORED_LEVEL } from './project-container.constants';
import type { ManifestParts } from './project-file.type';

const deflated = { level: DEFLATE_LEVEL } as const;
const stored = { level: STORED_LEVEL } as const;

const buildProjectZippable = (parts: ManifestParts): Zippable => {
  const files: Zippable = {
    [CONTAINER_ENTRY.mimetype]: [strToU8(ASSET_FORMAT.project.mime), stored],
    [CONTAINER_ENTRY.manifest]: [strToU8(JSON.stringify(buildContainerManifest(parts), null, JSON_INDENT)), deflated],
    [CONTAINER_ENTRY.document]: [parts.documentBytes, deflated],
  };
  for (const path of [...parts.assets.keys()].sort()) {
    const bytes = parts.assets.get(path);
    if (bytes) files[path] = [bytes, stored];
  }
  if (parts.preview) files[CONTAINER_ENTRY.preview] = [parts.preview, stored];
  return files;
};

export { buildProjectZippable };
