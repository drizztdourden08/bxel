/* @layer core @kind logic */
import { z } from 'zod';
import { ID_PREFIX } from '../ids/id-prefix.constants';
import type { LayerId } from '../model/ids.type';
import { brandedIdSchema } from './branded-id-schema';
import { layerRefSchema } from './layer-ref-schema';

const layerReorderSchema = z.strictObject({
  layer: layerRefSchema,
  to: z.number().int().min(0).describe('The index from the bottom, counted among the layers that stay. A group moves with its children.'),
  parentId: brandedIdSchema<LayerId>(ID_PREFIX.layer)
    .nullable()
    .optional()
    .describe('The group the layer joins, or null for the top level. Absent: the layer joins the group of the layer above the new place.'),
});

export { layerReorderSchema };
