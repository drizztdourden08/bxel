/* @layer core @kind logic */
import { z } from 'zod';
import { guideAxisSchema } from './guide-axis-schema';
import { guidePositionSchema } from './guide-position-schema';

const guideAddSchema = z.strictObject({ axis: guideAxisSchema, position: guidePositionSchema });

export { guideAddSchema };
