/* @layer core @kind logic */
import { z } from 'zod';
import { MAX_SPRITE_SIZE } from '../model/limits.constants';
import { DEFAULT_COLLISION_LAYER, MAX_COLLISION_POINTS } from '../model/tilemap-limits.constants';
import { pointSchema } from './point-schema';

const coordinate = z.number().int().min(0).max(MAX_SPRITE_SIZE);

const extent = z.number().int().min(1).max(MAX_SPRITE_SIZE);

const layerName = z.string().min(1).max(32).default(DEFAULT_COLLISION_LAYER);

const tileShapeSchema = z.discriminatedUnion('kind', [
  z.strictObject({ kind: z.literal('full'), layer: layerName, oneWay: z.boolean().optional() }),
  z.strictObject({
    kind: z.literal('rect'),
    x: coordinate,
    y: coordinate,
    width: extent,
    height: extent,
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
