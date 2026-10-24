/* @layer core @kind logic */
import { z } from 'zod';
import { MAX_ENTRY_BYTES } from '../native/container.constants';
import { archivePathSchema } from './archive-path-schema';

const manifestEntrySchema = z.object({
  path: archivePathSchema,
  length: z.number().int().min(0).max(MAX_ENTRY_BYTES),
  crc32: z.string().regex(/^[0-9a-f]{8}$/),
});

export { manifestEntrySchema };
