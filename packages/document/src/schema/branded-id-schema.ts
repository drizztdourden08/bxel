/* @layer core @kind logic */
import { z } from 'zod';
import type { IdPrefix } from '../ids/id-source.type';
import { isId } from '../ids/is-id';

const brandedIdSchema = <T extends string>(prefix: IdPrefix) =>
  z.custom<T>((value) => typeof value === 'string' && isId(value, prefix));

export { brandedIdSchema };
