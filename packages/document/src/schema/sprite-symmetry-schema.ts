/* @layer core @kind logic */
import { z } from 'zod';
import { MAX_SPRITE_SIZE } from '../model/limits.constants';

const axis = z.number().int().min(0).max(MAX_SPRITE_SIZE * 2).nullable();

const spriteSymmetrySchema = z.strictObject({
  x: z.boolean(),
  y: z.boolean(),
  axisX: axis,
  axisY: axis,
  diagonal: z.boolean(),
  turn: z.boolean(),
});

export { spriteSymmetrySchema };
