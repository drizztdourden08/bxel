/* @layer core @kind logic */
import { z } from 'zod';
import { ID_PREFIX } from '../ids/id-prefix.constants';
import type { AnimationId, SheetId, SpriteId, TagId } from '../model/ids.type';
import { assetGuidesSchema } from './asset-guides-schema';
import { brandedIdSchema } from './branded-id-schema';
import { createdSchema } from './created-schema';
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

const animationEntrySchema = z.object({
  animationId: brandedIdSchema<AnimationId>(ID_PREFIX.animation),
  tagId: brandedIdSchema<TagId>(ID_PREFIX.tag).nullable(),
  at: pointSchema,
});

const sheetSchema = z.object({
  id: brandedIdSchema<SheetId>(ID_PREFIX.sheet),
  name: nameSchema,
  created: createdSchema.optional(),
  layout: layoutSchema,
  spacing: pointSchema,
  margin: z.number().int().min(0),
  entries: z.array(entrySchema),
  animationEntries: z.array(animationEntrySchema).optional(),
  guides: assetGuidesSchema.optional(),
});

export { sheetSchema };
