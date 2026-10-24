/* @layer core @kind logic */
import { z } from 'zod';
import { CONTAINER_ENTRY, CONTAINER_FORMAT, CONTAINER_VERSION } from './project-container.constants';

const containerManifestSchema = z.object({
  format: z.literal(CONTAINER_FORMAT),
  kind: z.literal('project'),
  formatVersion: z.number().int().min(CONTAINER_VERSION),
  minReaderVersion: z.number().int().min(CONTAINER_VERSION),
  savedAt: z.string(),
  assetId: z.string().min(1),
  name: z.string().min(1),
  document: z.literal(CONTAINER_ENTRY.document),
  preview: z.literal(CONTAINER_ENTRY.preview).nullable(),
  entries: z.array(z.object({ path: z.string().min(1), length: z.number().int().min(0), crc32: z.string() })),
});

export { containerManifestSchema };
