/* @layer core @kind logic */
import { spriteSymmetrySchema } from './sprite-symmetry-schema';

const spriteSymmetryOptionsSchema = spriteSymmetrySchema
  .partial()
  .describe('The mirror state of a sprite: x and y turn the mirror axes on, axisX and axisY are the doubled pixel coordinate of each axis (null is the centre), diagonal and turn add the crossing modes. Fields left out keep their value.');

export { spriteSymmetryOptionsSchema };
