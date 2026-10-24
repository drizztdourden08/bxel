/* @layer core @kind logic */
import { z } from 'zod';
import { targetScopeSchema } from './scope-schema';

const presetScopeSchema = targetScopeSchema.extend({ sprites: z.array(targetScopeSchema.shape.sprites.element) });

export { presetScopeSchema };
