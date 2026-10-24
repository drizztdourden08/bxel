/* @layer core @kind logic */
import { MAX_SPRITE_SIZE } from '@bxel/document';
import { z } from 'zod';
import { resizeAnchorSchema } from './resize-anchor-schema';

const side = z.number().int().min(1).max(MAX_SPRITE_SIZE);

const spriteResizeSchema = z.strictObject({ width: side, height: side, anchor: resizeAnchorSchema.default('center') });

export { spriteResizeSchema };
