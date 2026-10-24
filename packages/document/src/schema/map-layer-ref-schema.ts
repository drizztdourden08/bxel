/* @layer core @kind logic */
import { z } from 'zod';
import { ID_PREFIX } from '../ids/id-prefix.constants';
import type { MapLayerId } from '../model/ids.type';
import { brandedIdSchema } from './branded-id-schema';

const mapLayerRefSchema = z.discriminatedUnion('by', [
  z.strictObject({ by: z.literal('id'), id: brandedIdSchema<MapLayerId>(ID_PREFIX.mapLayer) }),
  z.strictObject({ by: z.literal('name'), name: z.string().min(1) }),
]);

export { mapLayerRefSchema };
