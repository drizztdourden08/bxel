/* @layer core @kind logic */
import { z } from 'zod';
import type { IdPrefix } from '../ids/id-source.type';
import { brandedIdSchema } from './branded-id-schema';

const entityRefSchema = <T extends string>(prefix: IdPrefix) =>
  z.union([brandedIdSchema<T>(prefix), z.strictObject({ ref: z.string().min(1) })]);

export { entityRefSchema };
