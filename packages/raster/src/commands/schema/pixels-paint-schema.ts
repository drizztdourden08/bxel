/* @layer core @kind logic */
import { z } from 'zod';
import { indexSchema } from './index-schema';
import { inkedStrokeFields } from './inked-stroke-fields';

const pixelsPaintSchema = z.strictObject({ index: indexSchema, ...inkedStrokeFields });

export { pixelsPaintSchema };
