/* @layer core @kind logic */
import { z } from 'zod';
import { MAX_MAP_LAYERS } from '../model/tilemap-limits.constants';
import { tilesetRefSchema } from './tileset-ref-schema';

const importLayerSchema = z.strictObject({
  name: z.string(),
  visible: z.boolean().default(true),
  locked: z.boolean().default(false),
  cells: z.instanceof(Uint32Array),
});

const tilemapImportSchema = z.strictObject({
  name: z.string(),
  tileset: tilesetRefSchema,
  columns: z.number().int(),
  rows: z.number().int(),
  layers: z.array(importLayerSchema).min(1).max(MAX_MAP_LAYERS),
});

export { tilemapImportSchema };
