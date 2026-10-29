/* @layer core @kind logic */
import { z } from 'zod';
import { brushRefSchema } from './brush-ref-schema';
import { nameSchema } from './name-schema';

const brushUpdateSchema = z.strictObject({ brush: brushRefSchema, name: nameSchema });

export { brushUpdateSchema };
