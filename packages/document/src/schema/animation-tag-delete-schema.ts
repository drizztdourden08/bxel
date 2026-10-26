/* @layer core @kind logic */
import { z } from 'zod';
import { animTagRefSchema } from './anim-tag-ref-schema';
import { animationRefSchema } from './animation-ref-schema';

const animationTagDeleteSchema = z.strictObject({ animation: animationRefSchema, tag: animTagRefSchema });

export { animationTagDeleteSchema };
