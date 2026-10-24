/* @layer core @kind logic */
import { MAX_SPRITE_SIZE } from '@bxel/document';
import { z } from 'zod';

const side = z.number().int().min(1).max(MAX_SPRITE_SIZE);

const spriteCropSchema = z.strictObject({ x: z.number().int().min(0), y: z.number().int().min(0), width: side, height: side });

export { spriteCropSchema };
