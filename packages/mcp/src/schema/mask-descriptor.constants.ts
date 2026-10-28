/* @layer core @kind constants */
import { z } from 'zod';
import { RENDER_SIDE_MAX } from '../limits/limits.constants';
import { RECT_SCHEMA } from './shapes.constants';

const coordinate = z.number().int().min(0).max(RENDER_SIDE_MAX);
const runs = z.array(z.tuple([coordinate, coordinate, coordinate])).max(RENDER_SIDE_MAX * RENDER_SIDE_MAX);
const point = z.strictObject({ x: coordinate, y: coordinate });

const FLATTENED = 'It looks at the picture of the first targeted sprite, every visible layer flattened.';

const MASK_DESCRIPTOR_SCHEMA = z
  .discriminatedUnion('by', [
    z.strictObject({ by: z.literal('rect'), rect: RECT_SCHEMA }),
    z.strictObject({ by: z.literal('ellipse'), rect: RECT_SCHEMA }),
    z.strictObject({ by: z.literal('polygon'), points: z.array(point).min(3).max(RENDER_SIDE_MAX) }),
    z.strictObject({ by: z.literal('runs'), runs }),
    z.strictObject({ by: z.literal('wand'), x: coordinate, y: coordinate, connectivity: z.union([z.literal(4), z.literal(8)]).default(4) }),
    z.strictObject({ by: z.literal('colour'), index: z.number().int().min(0).max(255) }),
    z.strictObject({ by: z.literal('opaque') }),
    z.strictObject({ by: z.literal('saved'), name: z.string().min(1).max(64) }),
  ])
  .describe(`A selection described instead of drawn, resolved by Bxel against the first targeted sprite. wand and colour pick pixels like the owner's Wand and Select by colour. ${FLATTENED}`)
  .meta({ id: 'MaskDescriptor' });

export { MASK_DESCRIPTOR_SCHEMA };
