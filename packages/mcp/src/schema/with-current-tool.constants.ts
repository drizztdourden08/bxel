/* @layer core @kind constants */
import { z } from 'zod';

const CURRENT_BRUSH = z.literal('current').describe('The brush of the owner tool now: its tip, size and angle. Pixel perfect is its own field.');

const CURRENT_INK = z.literal('current').describe('The ink of the owner tool now, with the colours the owner has set.');

export { CURRENT_BRUSH, CURRENT_INK };
