/* @layer core @kind logic */
import { z } from 'zod';
import { MAX_COLLISION_POINTS } from '../model/tilemap-limits.constants';
import { pointSchema } from './point-schema';
import { COORDINATE_SCHEMA, EXTENT_SCHEMA } from './shape-extent.constants';

const collisionSchema = z.discriminatedUnion('kind', [
  z.strictObject({ kind: z.literal('full') }),
  z.strictObject({ kind: z.literal('rect'), x: COORDINATE_SCHEMA, y: COORDINATE_SCHEMA, width: EXTENT_SCHEMA, height: EXTENT_SCHEMA }),
  z.strictObject({ kind: z.literal('polygon'), points: z.array(pointSchema).min(3).max(MAX_COLLISION_POINTS) }),
]);

export { collisionSchema };
