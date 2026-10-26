/* @layer core @kind logic */
import { z } from 'zod';
import { guideAxisSchema } from './guide-axis-schema';
import { guidePositionSchema } from './guide-position-schema';

const guideMoveSchema = z.strictObject({ axis: guideAxisSchema, from: guidePositionSchema, to: guidePositionSchema });

export { guideMoveSchema };
