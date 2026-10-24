/* @layer core @kind logic */
import { z } from 'zod';

const tagDirectionSchema = z.enum(['forward', 'reverse', 'pingpong']);

export { tagDirectionSchema };
