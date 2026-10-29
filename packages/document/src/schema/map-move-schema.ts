/* @layer core @kind logic */
import { z } from 'zod';
import { cellMaskSchema } from './cell-mask-schema';
import { cellPointSchema } from './cell-point-schema';
import { mapLayerRefSchema } from './map-layer-ref-schema';
import { tilemapRefSchema } from './tilemap-ref-schema';

const mapMoveSchema = z.strictObject({
  tilemap: tilemapRefSchema,
  layer: mapLayerRefSchema,
  from: cellMaskSchema,
  to: cellPointSchema.describe('Where the top left cell of the described cells lands. The cells they leave are cleared.'),
  empty: z.enum(['skip', 'copy']).default('skip').describe('skip leaves the target alone where a moved cell is empty. copy clears it.'),
});

export { mapMoveSchema };
