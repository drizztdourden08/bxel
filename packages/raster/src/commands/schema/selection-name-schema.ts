/* @layer core @kind logic */
import { z } from 'zod';
import { SELECTION_NAME_MAX } from './selection-name-schema.constants';

const selectionNameSchema = z.string().min(1).max(SELECTION_NAME_MAX);

export { selectionNameSchema };
