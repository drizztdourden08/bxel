/* @layer core @kind logic */
import { z } from 'zod';
import { animationRefSchema } from './animation-ref-schema';

const animationDeleteSchema = z.strictObject({ animation: animationRefSchema });

export { animationDeleteSchema };
