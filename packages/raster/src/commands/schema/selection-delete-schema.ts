/* @layer core @kind logic */
import { z } from 'zod';
import { selectionNameSchema } from './selection-name-schema';

const selectionDeleteSchema = z.strictObject({ name: selectionNameSchema });

export { selectionDeleteSchema };
