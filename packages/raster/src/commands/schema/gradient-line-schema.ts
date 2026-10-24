/* @layer core @kind logic */
import { z } from 'zod';
import { pointSchema } from './point-schema';

const gradientLineSchema = z
  .strictObject({ from: pointSchema, to: pointSchema })
  .refine((line) => line.from.x !== line.to.x || line.from.y !== line.to.y, {
    message: 'from and to must be different points.',
    path: ['to'],
  });

export { gradientLineSchema };
