/* @layer core @kind logic */
import { idSchema, pivotSchema } from '@bxel/document/schema';
import { z } from 'zod';
import { DITHER_NAMES, IMPORT_MAPPING_DEFAULT } from './import-mapping.constants';

const imageSchema = z.strictObject({
  width: z.number().int(),
  height: z.number().int(),
  rgba: z.instanceof(Uint8Array),
});

const bankSchema = z.union([
  z.strictObject({ bankId: idSchema('bnk') }),
  z.strictObject({ ref: z.string().min(1) }),
]);

const mappingSchema = z.strictObject({
  dither: z.enum(DITHER_NAMES).default(IMPORT_MAPPING_DEFAULT.dither),
  originX: z.number().int().default(IMPORT_MAPPING_DEFAULT.originX),
  originY: z.number().int().default(IMPORT_MAPPING_DEFAULT.originY),
  alphaThreshold: z.number().int().min(0).max(255).default(IMPORT_MAPPING_DEFAULT.alphaThreshold),
});

const spriteImportSchema = z.strictObject({
  name: z.string(),
  image: imageSchema,
  bank: bankSchema,
  mapping: mappingSchema.default(IMPORT_MAPPING_DEFAULT),
  pivot: pivotSchema.optional(),
});

export { spriteImportSchema };
