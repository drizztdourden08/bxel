/* @layer core @kind logic */
import { z } from 'zod';
import { cellMaskSchema } from './cell-mask-schema';
import { cellPointSchema } from './cell-point-schema';
import { mapLayerRefSchema } from './map-layer-ref-schema';
import { tilemapRefSchema } from './tilemap-ref-schema';

const mapCopySchema = z.strictObject({
  tilemap: tilemapRefSchema,
  layer: mapLayerRefSchema,
  from: cellMaskSchema,
  to: cellPointSchema.describe('Where the top left cell of the described cells lands. The shape of the cells is kept, with their tile keys and turn bits.'),
  intoLayer: mapLayerRefSchema.optional().describe('Another layer of the same tilemap to write into. The default is the layer the cells come from.'),
  empty: z.enum(['skip', 'copy']).default('skip').describe('skip leaves the target alone where a copied cell is empty. copy clears it.'),
});

export { mapCopySchema };
