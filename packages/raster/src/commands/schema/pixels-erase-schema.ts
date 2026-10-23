/* @layer core @kind logic */
import { z } from 'zod';
import { strokeFields } from './stroke-fields';

const pixelsEraseSchema = z.strictObject(strokeFields);

export { pixelsEraseSchema };
