/* @layer core @kind logic */
import { z } from 'zod';
import { indexSchema } from './index-schema';
import { strokeFields } from './stroke-fields';

const pixelsPaintSchema = z.strictObject({ index: indexSchema, ...strokeFields });

export { pixelsPaintSchema };
