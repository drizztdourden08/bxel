/* @layer core @kind logic */
import { MAX_NAME_LENGTH } from '@bxel/document';
import { z } from 'zod';

const rampNameSchema = z.string().min(1).max(MAX_NAME_LENGTH);

export { rampNameSchema };
