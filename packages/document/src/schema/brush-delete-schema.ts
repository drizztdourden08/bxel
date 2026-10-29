/* @layer core @kind logic */
import { z } from 'zod';
import { brushRefSchema } from './brush-ref-schema';

const brushDeleteSchema = z.strictObject({ brush: brushRefSchema });

export { brushDeleteSchema };
