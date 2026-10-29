/* @layer core @kind logic */
import { z } from 'zod';
import { inkedStrokeFields } from './inked-stroke-fields';

const pixelsEraseSchema = z.strictObject(inkedStrokeFields);

export { pixelsEraseSchema };
