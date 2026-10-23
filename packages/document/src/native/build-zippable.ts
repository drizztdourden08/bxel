/* @layer core @kind logic */
import { strToU8 } from 'fflate';
import type { Zippable } from 'fflate';
import { buildManifest } from './build-manifest';
import type { ContainerParts } from './container-parts.type';
import { DEFLATE_LEVEL, ENTRY, MIMETYPE, STORED_LEVEL } from './container.constants';

const deflated = { level: DEFLATE_LEVEL } as const;
const stored = { level: STORED_LEVEL } as const;

const buildZippable = (parts: ContainerParts): Zippable => {
  const manifestBytes = strToU8(JSON.stringify(buildManifest(parts), null, 2));
  const files: Zippable = {
    [ENTRY.mimetype]: [strToU8(MIMETYPE), stored],
    [ENTRY.manifest]: [manifestBytes, deflated],
    [ENTRY.document]: [parts.documentBytes, deflated],
  };
  for (const [path, bytes] of parts.blobs) files[path] = [bytes, deflated];
  if (parts.preview) files[ENTRY.preview] = [parts.preview, stored];
  return files;
};

export { buildZippable };
