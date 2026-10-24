/* @layer core @kind logic */
import { z } from 'zod';
import { DITHER_NAMES, IMPORT_MAPPING_DEFAULT } from './import-mapping.constants';

const importMappingSchema = z.strictObject({
  dither: z.enum(DITHER_NAMES).default(IMPORT_MAPPING_DEFAULT.dither),
  originX: z.number().int().default(IMPORT_MAPPING_DEFAULT.originX),
  originY: z.number().int().default(IMPORT_MAPPING_DEFAULT.originY),
  alphaThreshold: z.number().int().min(0).max(255).default(IMPORT_MAPPING_DEFAULT.alphaThreshold),
});

export { importMappingSchema };
