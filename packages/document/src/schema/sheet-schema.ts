/* @layer core @kind logic */
import { z } from 'zod';
import { ID_PREFIX } from '../ids/id-prefix.constants';
import type { SheetId, SpriteId } from '../model/ids.type';
import { brandedIdSchema } from './branded-id-schema';
import { nameSchema } from './name-schema';
import { pointSchema } from './point-schema';
import { rectSchema } from './rect-schema';

const positive = z.number().int().min(1);

const layoutSchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('manual') }),
  z.object({
    kind: z.literal('grid'),
    columns: positive,
    cellWidth: positive,
    cellHeight: positive,
    order: z.enum(['rows', 'columns']),
  }),
  z.object({ kind: z.literal('packed'), maxWidth: positive }),
]);

const entrySchema = z.object({
  spriteId: brandedIdSchema<SpriteId>(ID_PREFIX.sprite),
  at: pointSchema,
  source: rectSchema.nullable(),
});

const sheetSchema = z.object({
  id: brandedIdSchema<SheetId>(ID_PREFIX.sheet),
  name: nameSchema,
  layout: layoutSchema,
  spacing: pointSchema,
  margin: z.number().int().min(0),
  entries: z.array(entrySchema),
});

export { sheetSchema };
