/* @layer core @kind constants */
import { z } from 'zod';

const DOCUMENT_INCLUDE_VALUES = ['guides', 'slices', 'presets', 'tags', 'tilesets'] as const;

const DOCUMENT_INCLUDE_SCHEMA = z
  .array(z.enum(DOCUMENT_INCLUDE_VALUES))
  .describe(
    'More detail. tags: the id, direction and repeat of every sprite tag. guides: the guide lines of sheets and tilemaps. presets: the export presets. tilesets: the terrain and every tile of each tileset. Sprites always list their slices and guides, so slices adds nothing more.',
  );

export { DOCUMENT_INCLUDE_SCHEMA };
