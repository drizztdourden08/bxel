/* @layer core @kind logic */
import { z } from 'zod';

const boundsPolicySchema = z.enum(['expand', 'crop', 'cancel']).default('crop');

export { boundsPolicySchema };
