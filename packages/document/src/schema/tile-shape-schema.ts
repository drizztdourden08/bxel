/* @layer core @kind logic */
import { z } from 'zod';
import { DEFAULT_COLLISION_LAYER, MAX_COLLISION_POINTS } from '../model/tilemap-limits.constants';
import { pointSchema } from './point-schema';
import { COORDINATE_SCHEMA, EXTENT_SCHEMA } from './shape-extent.constants';

const layerName = z.string().min(1).max(32).default(DEFAULT_COLLISION_LAYER);

const tileShapeSchema = z.discriminatedUnion('kind', [
  z.strictObject({ kind: z.literal('full'), layer: layerName, oneWay: z.boolean().optional() }),
  z.strictObject({
    kind: z.literal('rect'),
    x: COORDINATE_SCHEMA,
    y: COORDINATE_SCHEMA,
    width: EXTENT_SCHEMA,
    height: EXTENT_SCHEMA,
    layer: layerName,
    oneWay: z.boolean().optional(),
  }),
  z.strictObject({
    kind: z.literal('polygon'),
    points: z.array(pointSchema).min(3).max(MAX_COLLISION_POINTS),
    layer: layerName,
    oneWay: z.boolean().optional(),
  }),
]);

export { tileShapeSchema };
