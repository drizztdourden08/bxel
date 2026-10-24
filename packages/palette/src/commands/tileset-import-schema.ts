/* @layer core @kind logic */
import { collisionSchema } from '@bxel/document/schema';
import { z } from 'zod';
import { importBankSchema } from './import-bank-schema';
import { importImageSchema } from './import-image-schema';
import { IMPORT_MAPPING_DEFAULT } from './import-mapping.constants';
import { importMappingSchema } from './import-mapping-schema';

const importTileSchema = z.strictObject({
  image: importImageSchema,
  originX: z.number().int().default(0),
  originY: z.number().int().default(0),
  collision: collisionSchema.optional(),
});

const tilesetImportSchema = z.strictObject({
  name: z.string(),
  tileWidth: z.number().int(),
  tileHeight: z.number().int(),
  bank: importBankSchema,
  mapping: importMappingSchema.default(IMPORT_MAPPING_DEFAULT),
  tiles: z.array(importTileSchema).min(1),
});

export { tilesetImportSchema };
