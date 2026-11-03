/* @layer core @kind constants */
import { z } from 'zod';
import { HEX_COLOR_SCHEMA } from './shapes.constants';

const GUIDE_COLOURS_INPUT_SCHEMA = z
  .array(
    z.strictObject({
      axis: z.enum(['x', 'y']),
      position: z.number().int().min(-100000).max(100000).describe('The guide line: a pixel column for x, a pixel row for y.'),
      colour: HEX_COLOR_SCHEMA.nullable().describe('#rrggbb, or null for the default colour.'),
    }),
  )
  .max(64)
  .describe('Colour of single guides, a view setting of the open asset. Add and move guides with the guide commands of run_command; the colour follows the guide.');

export { GUIDE_COLOURS_INPUT_SCHEMA };
