/* @layer core @kind logic */
import { z } from 'zod';
import { guideAxisSchema } from './guide-axis-schema';
import { guidePositionSchema } from './guide-position-schema';

const guideRemoveSchema = z.strictObject({ axis: guideAxisSchema, position: guidePositionSchema });

export { guideRemoveSchema };
