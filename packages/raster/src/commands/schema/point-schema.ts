/* @layer core @kind logic */
import { z } from 'zod';
import { COORD_LIMIT } from '../pixels-limits.constants';

const coordinate = z.number().int().min(-COORD_LIMIT).max(COORD_LIMIT);

const pointSchema = z.strictObject({ x: coordinate, y: coordinate });

export { pointSchema };
