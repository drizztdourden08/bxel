/* @layer core @kind logic */
import { z } from 'zod';
import { idSchema } from './id-schema';

const spriteRefSchema = z.union([idSchema('spr'), z.strictObject({ ref: z.string().min(1) })]);

const layerSelectorSchema = z.discriminatedUnion('by', [
  z.strictObject({ by: z.literal('ids'), ids: z.array(idSchema('lay')).min(1) }),
  z.strictObject({ by: z.literal('names'), names: z.array(z.string().min(1)).min(1) }),
  z.strictObject({ by: z.literal('all') }),
]);

const frameSelectorSchema = z.discriminatedUnion('by', [
  z.strictObject({ by: z.literal('ids'), ids: z.array(idSchema('frm')).min(1) }),
  z.strictObject({ by: z.literal('range'), from: z.number().int().min(0), to: z.number().int().min(0) }),
  z.strictObject({ by: z.literal('tag'), name: z.string().min(1) }),
  z.strictObject({ by: z.literal('all') }),
]);

const targetScopeSchema = z.strictObject({
  sprites: z.array(spriteRefSchema).min(1),
  layers: layerSelectorSchema,
  frames: frameSelectorSchema,
});

export { targetScopeSchema };
