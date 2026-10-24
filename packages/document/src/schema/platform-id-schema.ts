/* @layer core @kind logic */
import { z } from 'zod';
import { PLATFORM_ID_PATTERN } from '../model/limits.constants';

const platformIdSchema = z.string().regex(PLATFORM_ID_PATTERN, { message: 'A platform id uses lowercase letters, digits and dashes, up to 64 characters.' });

export { platformIdSchema };
