/* @layer core @kind logic */
import { z } from 'zod';
import { CONTROL_PATTERN, ORGANISE_LIMITS } from './organise.constants';

const idSchema = z.string().min(1).max(ORGANISE_LIMITS.idMax);

const textSchema = (max: number) =>
  z
    .string()
    .min(1)
    .max(max)
    .refine((text) => !CONTROL_PATTERN.test(text) && text.trim() === text, { message: 'Plain text without control characters or spaces at the ends.' });

const tagSchema = textSchema(ORGANISE_LIMITS.tagMax);

const organiseSchema = z.strictObject({
  tags: z
    .record(idSchema, z.array(tagSchema).min(1).max(ORGANISE_LIMITS.tagsPerAsset))
    .refine((tags) => Object.keys(tags).length <= ORGANISE_LIMITS.taggedMax, { message: 'Too many tagged files.' })
    .default({}),
  collections: z
    .array(z.strictObject({ id: idSchema, name: textSchema(ORGANISE_LIMITS.nameMax), assets: z.array(idSchema).max(ORGANISE_LIMITS.assetsPerCollection) }))
    .max(ORGANISE_LIMITS.collectionsMax)
    .default([]),
  smart: z
    .array(z.strictObject({ id: idSchema, name: textSchema(ORGANISE_LIMITS.nameMax), query: textSchema(ORGANISE_LIMITS.queryMax) }))
    .max(ORGANISE_LIMITS.smartMax)
    .default([]),
  pinned: z.array(idSchema).max(ORGANISE_LIMITS.pinnedMax).default([]),
});

export { organiseSchema };
