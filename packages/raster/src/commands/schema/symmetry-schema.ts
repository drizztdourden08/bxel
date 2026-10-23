/* @layer core @kind logic */
import { z } from 'zod';
import { AXIS_LIMIT } from '../pixels-limits.constants';

const axis = z.number().int().min(-AXIS_LIMIT).max(AXIS_LIMIT).optional();

const symmetrySchema = z.strictObject({ x2: axis, y2: axis }).default({});

export { symmetrySchema };
