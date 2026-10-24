/* @layer core @kind logic */
import { pivotSchema } from '@bxel/document/schema';
import { z } from 'zod';
import { importBankSchema } from './import-bank-schema';
import { importImageSchema } from './import-image-schema';
import { IMPORT_MAPPING_DEFAULT } from './import-mapping.constants';
import { importMappingSchema } from './import-mapping-schema';

const spriteImportSchema = z.strictObject({
  name: z.string(),
  image: importImageSchema,
  bank: importBankSchema,
  mapping: importMappingSchema.default(IMPORT_MAPPING_DEFAULT),
  pivot: pivotSchema.optional(),
});

export { spriteImportSchema };
