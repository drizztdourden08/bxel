/* @layer core @kind logic */
import { z } from 'zod';
import { guideAxisSchema } from './guide-axis-schema';

const guideClearSchema = z.strictObject({ axis: guideAxisSchema.optional() });

export { guideClearSchema };
