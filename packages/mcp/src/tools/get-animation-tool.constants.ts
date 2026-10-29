/* @layer core @kind constants */
import { z } from 'zod';

const DIRECTION_SCHEMA = z.enum(['forward', 'reverse', 'pingpong', 'pingpongReverse']);
const FACING_SCHEMA = z.enum(['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw']);

export { DIRECTION_SCHEMA, FACING_SCHEMA };
