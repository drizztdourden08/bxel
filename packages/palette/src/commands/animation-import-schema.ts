/* @layer core @kind logic */
import { MAX_ANIMATION_FRAMES, MAX_SPRITE_SIZE } from '@bxel/document';
import { pivotSchema } from '@bxel/document/schema';
import { z } from 'zod';
import { importBankSchema } from './import-bank-schema';
import { importFrameSchema } from './import-frame-schema';
import { IMPORT_MAPPING_DEFAULT } from './import-mapping.constants';
import { importMappingSchema } from './import-mapping-schema';

const side = z.number().int().min(1).max(MAX_SPRITE_SIZE);

const animationImportSchema = z.strictObject({
  name: z.string(),
  width: side,
  height: side,
  bank: importBankSchema,
  mapping: importMappingSchema.default(IMPORT_MAPPING_DEFAULT),
  anchor: pivotSchema.optional(),
  frames: z.array(importFrameSchema).min(1).max(MAX_ANIMATION_FRAMES),
});

export { animationImportSchema };
