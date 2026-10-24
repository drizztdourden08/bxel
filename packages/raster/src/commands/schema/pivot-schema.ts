/* @layer core @kind logic */
import { z } from 'zod';
import { AXIS_LIMIT } from '../pixels-limits.constants';

const doubled = z.number().int().min(-AXIS_LIMIT).max(AXIS_LIMIT);

const pivotSchema = z.strictObject({ x2: doubled, y2: doubled }).optional();

export { pivotSchema };
