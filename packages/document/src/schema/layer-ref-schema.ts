/* @layer core @kind logic */
import { z } from 'zod';
import { ID_PREFIX } from '../ids/id-prefix.constants';
import type { LayerId } from '../model/ids.type';
import { brandedIdSchema } from './branded-id-schema';

const layerRefSchema = z.discriminatedUnion('by', [
  z.strictObject({ by: z.literal('id'), id: brandedIdSchema<LayerId>(ID_PREFIX.layer) }),
  z.strictObject({ by: z.literal('name'), name: z.string().min(1) }),
]);

export { layerRefSchema };
