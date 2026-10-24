/* @layer core @kind logic */
import type { z } from 'zod';
import type { ManifestCore } from './manifest-core.type';

const refineManifest = <T extends ManifestCore>(schema: z.ZodType<T>): z.ZodType<T> =>
  schema
    .refine((manifest) => manifest.minReaderVersion <= manifest.formatVersion, {
      path: ['minReaderVersion'],
      message: 'The minimum reader version cannot pass the format version.',
    })
    .refine((manifest) => new Set(manifest.entries.map((entry) => entry.path)).size === manifest.entries.length, {
      path: ['entries'],
      message: 'Entry paths are unique.',
    });

export { refineManifest };
