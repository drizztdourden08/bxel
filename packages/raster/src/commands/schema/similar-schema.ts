/* @layer core @kind logic */
import { z } from 'zod';
import { SIMILAR_HELP, SIMILAR_MAX } from './algorithm-schema.constants';

const similarSchema = z.number().min(0).max(SIMILAR_MAX).default(0).describe(SIMILAR_HELP);

export { similarSchema };
