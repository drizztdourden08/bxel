/* @layer core @kind logic */
import { z } from 'zod';
import { ID_PREFIX } from '../ids/id-prefix.constants';
import type { ProjectId } from '../model/ids.type';
import { FORMAT_NAME, MAX_ENTRY_BYTES } from '../native/container.constants';
import { brandedIdSchema } from './branded-id-schema';

const isSafePath = (path: string): boolean =>
  !path.startsWith('/') && !path.includes('\\') && !path.split('/').includes('..');

const pathSchema = z.string().min(1).refine(isSafePath, { message: 'A path stays inside the archive.' });

const entrySchema = z.object({
  path: pathSchema,
  length: z.number().int().min(0).max(MAX_ENTRY_BYTES),
  crc32: z.string().regex(/^[0-9a-f]{8}$/),
});

const manifestSchema = z
  .object({
    format: z.literal(FORMAT_NAME),
    formatVersion: z.number().int().min(1),
    minReaderVersion: z.number().int().min(1),
    writer: z.object({ app: z.string(), version: z.string() }),
    savedAt: z.string(),
    projectId: brandedIdSchema<ProjectId>(ID_PREFIX.project),
    document: pathSchema,
    preview: pathSchema.nullable(),
    entries: z.array(entrySchema),
  })
  .refine((manifest) => manifest.minReaderVersion <= manifest.formatVersion, {
    path: ['minReaderVersion'],
    message: 'The minimum reader version cannot pass the format version.',
  })
  .refine((manifest) => new Set(manifest.entries.map((entry) => entry.path)).size === manifest.entries.length, {
    path: ['entries'],
    message: 'Entry paths are unique.',
  });

export { manifestSchema };
