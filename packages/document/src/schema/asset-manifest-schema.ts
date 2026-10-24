/* @layer core @kind logic */
import { z } from 'zod';
import { ASSET_KIND } from '../model/asset-format.constants';
import { FORMAT_NAME } from '../native/container.constants';
import { ASSET_FORMAT_VERSION } from '../native/v2/asset-container.constants';
import { archivePathSchema } from './archive-path-schema';
import { assetLinkSchema } from './asset-link-schema';
import { manifestEntrySchema } from './manifest-entry-schema';
import { nameSchema } from './name-schema';
import { refineManifest } from './refine-manifest';

const assetManifestSchema = refineManifest(
  z.object({
    format: z.literal(FORMAT_NAME),
    kind: z.enum(ASSET_KIND),
    formatVersion: z.number().int().min(ASSET_FORMAT_VERSION),
    minReaderVersion: z.number().int().min(ASSET_FORMAT_VERSION),
    writer: z.object({ app: z.string(), version: z.string() }),
    savedAt: z.string(),
    assetId: z.string().min(1).max(128),
    name: nameSchema,
    document: archivePathSchema,
    preview: archivePathSchema.nullable(),
    links: z.array(assetLinkSchema),
    entries: z.array(manifestEntrySchema),
  }),
).refine((manifest) => new Set(manifest.links.map((link) => link.id)).size === manifest.links.length, {
  path: ['links'],
  message: 'Link ids are unique.',
});

export { assetManifestSchema };
