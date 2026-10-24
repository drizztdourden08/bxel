/* @layer core @kind logic */
import { z } from 'zod';
import { MAX_SPRITE_SIZE } from '../model/limits.constants';

const orientationSchema = z.strictObject({
  kind: z.enum(['isometric', 'staggered', 'hexagonal']),
  staggerAxis: z.enum(['x', 'y']),
  staggerIndex: z.enum(['odd', 'even']),
  hexSideLength: z.number().int().min(0).max(MAX_SPRITE_SIZE),
});

export { orientationSchema };
