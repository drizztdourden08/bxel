/* @layer core @kind logic */
import { MAX_SPRITE_SIZE } from '@bxel/document';
import { z } from 'zod';
import { SCALE_FACTOR_MAX } from '../advanced-commands.constants';

const factor = z.number().int().min(1).max(SCALE_FACTOR_MAX);
const side = z.number().int().min(1).max(MAX_SPRITE_SIZE);

const scaleTargetSchema = z.discriminatedUnion('by', [
  z.strictObject({ by: z.literal('factor'), x: factor, y: factor }),
  z.strictObject({ by: z.literal('size'), width: side, height: side }),
]);

export { scaleTargetSchema };
