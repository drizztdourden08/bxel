/* @layer core @kind logic */
import { z } from 'zod';
import { TAG_COLOUR_PATTERN } from '../model/limits.constants';

const tagColourSchema = z.string().regex(TAG_COLOUR_PATTERN, { message: 'A tag colour is a hex colour such as #3b82f6.' });

export { tagColourSchema };
