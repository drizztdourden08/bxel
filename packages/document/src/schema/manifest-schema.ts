/* @layer core @kind logic */
import { z } from 'zod';
import { ID_PREFIX } from '../ids/id-prefix.constants';
import type { ArtworkId } from '../model/ids.type';
import { FORMAT_NAME } from '../native/container.constants';
import { archivePathSchema } from './archive-path-schema';
import { brandedIdSchema } from './branded-id-schema';
import { manifestEntrySchema } from './manifest-entry-schema';
import { refineManifest } from './refine-manifest';

const manifestSchema = refineManifest(
  z.object({
    format: z.literal(FORMAT_NAME),
    formatVersion: z.number().int().min(1),
    minReaderVersion: z.number().int().min(1),
    writer: z.object({ app: z.string(), version: z.string() }),
    savedAt: z.string(),
    artworkId: brandedIdSchema<ArtworkId>(ID_PREFIX.artwork),
    document: archivePathSchema,
    preview: archivePathSchema.nullable(),
    entries: z.array(manifestEntrySchema),
  }),
);

export { manifestSchema };
