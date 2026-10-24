/* @layer core @kind logic */
import { z } from 'zod';
import { MAX_SPRITE_SIZE } from '../model/limits.constants';

const orientRequestSchema = z.strictObject({
  kind: z.enum(['orthogonal', 'isometric', 'staggered', 'hexagonal']),
  staggerAxis: z.enum(['x', 'y']).optional(),
  staggerIndex: z.enum(['odd', 'even']).optional(),
  hexSideLength: z.number().int().min(1).max(MAX_SPRITE_SIZE).optional(),
});

export { orientRequestSchema };
