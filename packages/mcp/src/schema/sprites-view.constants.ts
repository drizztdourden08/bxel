/* @layer core @kind constants */
import { z } from 'zod';
import { SPRITE_ID_SCHEMA } from './ids.constants';

const SPRITES_SORT_VALUES = ['manual', 'name', 'size', 'area', 'bank', 'created'] as const;

const SPRITES_KIND_VALUES = ['all', 'sprites', 'animations'] as const;

const SPRITES_IDENTICAL_VALUES = ['off', 'same', 'flips'] as const;

const SPRITES_FILTER_SCHEMA = z.strictObject({
  kind: z.enum(SPRITES_KIND_VALUES).optional(),
  slices: z.boolean().optional().describe('Only sprites that have slices.'),
  size: z.string().min(1).max(40).nullable().optional().describe('A size chip such as 16x16. Null clears it.'),
  identical: z.enum(SPRITES_IDENTICAL_VALUES).optional(),
  tag: z.string().min(1).max(100).nullable().optional(),
  bank: z.string().min(1).max(100).nullable().optional(),
});

const SPRITES_INPUT_SCHEMA = z.strictObject({
  query: z.string().max(500).optional().describe('The search text of the Sprites panel.'),
  filter: SPRITES_FILTER_SCHEMA.optional().describe('The chips. A chip left out keeps its value.'),
  sort: z
    .strictObject({ key: z.enum(SPRITES_SORT_VALUES), descending: z.boolean().default(false) })
    .optional()
    .describe('The sort order. manual keeps the order of the sheet.'),
  view: z.enum(['grid', 'list']).optional(),
  size: z.number().int().min(24).max(128).optional().describe('The thumbnail size in pixels, 24 to 128.'),
  collapsed: z.array(z.string().min(1).max(500)).max(512).optional().describe('The folder paths that are closed. This list replaces the old one.'),
  selections: z
    .array(z.strictObject({ name: z.string().min(1).max(100), ids: z.array(SPRITE_ID_SCHEMA).max(4096) }))
    .max(64)
    .optional()
    .describe('The saved selections, each a name and the sprite ids it holds. The list replaces the old one; a name used twice keeps the last.'),
});

export { SPRITES_INPUT_SCHEMA };
