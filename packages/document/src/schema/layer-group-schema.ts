/* @layer core @kind logic */
import { z } from 'zod';
import { MAX_GROUPED } from './layer-group-schema.constants';
import { layerRefSchema } from './layer-ref-schema';

const layerGroupSchema = z.strictObject({
  layers: z.array(layerRefSchema).min(1).max(MAX_GROUPED).describe('The layers that go into the new group. They share one group today, or none.'),
  name: z.string().optional(),
});

export { layerGroupSchema };
