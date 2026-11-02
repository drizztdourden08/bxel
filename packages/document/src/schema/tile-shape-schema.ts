/* @layer core @kind logic */
import { z } from 'zod';
import { DEFAULT_COLLISION_LAYER, MAX_COLLISION_POINTS } from '../model/tilemap-limits.constants';
import { HALF_COORDINATE_SCHEMA, HALF_EXTENT_SCHEMA, HALF_POINT_SCHEMA } from './shape-extent.constants';

const layerName = z.string().min(1).max(32).default(DEFAULT_COLLISION_LAYER);

const tileShapeSchema = z.discriminatedUnion('kind', [
  z.strictObject({ kind: z.literal('full'), layer: layerName, oneWay: z.boolean().optional() }),
  z.strictObject({
    kind: z.literal('rect'),
    x: HALF_COORDINATE_SCHEMA,
    y: HALF_COORDINATE_SCHEMA,
    width: HALF_EXTENT_SCHEMA,
    height: HALF_EXTENT_SCHEMA,
    layer: layerName,
    oneWay: z.boolean().optional(),
  }),
  z.strictObject({
    kind: z.literal('polygon'),
    points: z.array(HALF_POINT_SCHEMA).min(3).max(MAX_COLLISION_POINTS),
    layer: layerName,
    oneWay: z.boolean().optional(),
  }),
]);

export { tileShapeSchema };
