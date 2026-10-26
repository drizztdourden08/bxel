/* @layer core @kind logic */
import { z } from 'zod';
import { ID_PREFIX } from '../ids/id-prefix.constants';
import type { TagId } from '../model/ids.type';
import { animationRefSchema } from './animation-ref-schema';
import { brandedIdSchema } from './branded-id-schema';
import { tileKeySchema } from './tile-key-schema';
import { tilesetRefSchema } from './tileset-ref-schema';

const tileAnimationSchema = z.strictObject({
  tileset: tilesetRefSchema,
  key: tileKeySchema.min(1),
  change: z.discriminatedUnion('kind', [
    z.strictObject({
      kind: z.literal('set'),
      animation: animationRefSchema,
      tag: brandedIdSchema<TagId>(ID_PREFIX.tag).nullable().default(null),
      start: z.enum(['together', 'random']).default('together'),
    }),
    z.strictObject({ kind: z.literal('clear') }),
  ]),
});

export { tileAnimationSchema };
