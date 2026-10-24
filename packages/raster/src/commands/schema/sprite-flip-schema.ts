/* @layer core @kind logic */
import { z } from 'zod';
import { flipAxisSchema } from './flip-axis-schema';

const spriteFlipSchema = z.strictObject({ axis: flipAxisSchema });

export { spriteFlipSchema };
