/* @layer core @kind logic */
import { z } from 'zod';
import { frameRefSchema } from './frame-ref-schema';
import { layerRefSchema } from './layer-ref-schema';

const celSlotSchema = z.strictObject({
  layer: layerRefSchema,
  frame: frameRefSchema,
});

export { celSlotSchema };
