/* @layer core @kind constants */
import { z } from 'zod';
import { RENDER_SIDE_MAX } from '../limits/limits.constants';
import { RECT_SCHEMA } from './shapes.constants';

const coordinate = z.number().int().min(0).max(RENDER_SIDE_MAX);
const runs = z.array(z.tuple([coordinate, coordinate, coordinate])).max(RENDER_SIDE_MAX * RENDER_SIDE_MAX);
const point = z.strictObject({ x: coordinate, y: coordinate });

const FLATTENED = 'It looks at the picture of the first targeted sprite, every visible layer flattened.';

const MAX_COMBINED = 16;

const BASE_MEMBERS = [
  z.strictObject({ by: z.literal('rect'), rect: RECT_SCHEMA }),
  z.strictObject({ by: z.literal('ellipse'), rect: RECT_SCHEMA }),
  z.strictObject({ by: z.literal('polygon'), points: z.array(point).min(3).max(RENDER_SIDE_MAX) }),
  z.strictObject({ by: z.literal('runs'), runs }),
  z.strictObject({ by: z.literal('wand'), x: coordinate, y: coordinate, connectivity: z.union([z.literal(4), z.literal(8)]).default(4) }),
  z.strictObject({ by: z.literal('colour'), index: z.number().int().min(0).max(255) }),
  z.strictObject({ by: z.literal('opaque') }),
  z.strictObject({ by: z.literal('saved'), name: z.string().min(1).max(64) }),
] as const;

const BASE_DESCRIPTOR_SCHEMA = z.discriminatedUnion('by', BASE_MEMBERS);

const COMBINE_MEMBER = z.strictObject({
  by: z.literal('combine'),
  op: z.enum(['add', 'subtract', 'intersect']).describe('add joins every part, subtract cuts every later part out of the first, intersect keeps only where all parts overlap.'),
  of: z.array(BASE_DESCRIPTOR_SCHEMA).min(2).max(MAX_COMBINED),
});

const MASK_DESCRIPTOR_SCHEMA = z
  .discriminatedUnion('by', [...BASE_MEMBERS, COMBINE_MEMBER])
  .describe(`A selection described instead of drawn, resolved by Bxel against the first targeted sprite. wand and colour pick pixels like the owner's Wand and Select by colour. combine joins, cuts or intersects a list of the other shapes. ${FLATTENED}`)
  .meta({ id: 'MaskDescriptor' });

export { MASK_DESCRIPTOR_SCHEMA };
