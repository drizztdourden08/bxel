/* @layer core @kind logic */
import { z } from 'zod';

const animDirectionSchema = z.enum(['forward', 'reverse', 'pingpong', 'pingpongReverse']);

export { animDirectionSchema };
