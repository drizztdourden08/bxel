/* @layer core @kind logic */
import { z } from 'zod';
import { sliceRefSchema } from './slice-ref-schema';

const sliceDeleteSchema = z.strictObject({ slice: sliceRefSchema });

export { sliceDeleteSchema };
