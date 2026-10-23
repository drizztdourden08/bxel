/* @layer core @kind logic */
import { z } from 'zod';
import { ID_BODY_PATTERN } from '../ids/id-pattern.constants';
import type { IdPrefix } from '../ids/id-source.type';

const idSchema = (prefix: IdPrefix) => z.string().regex(new RegExp(`^${prefix}_${ID_BODY_PATTERN}$`));

export { idSchema };
