/* @layer core @kind logic */
import { z } from 'zod';
import { MAX_GUIDES } from '../model/limits.constants';
import { guidePositionSchema } from './guide-position-schema';

const line = z.array(guidePositionSchema).max(MAX_GUIDES);

const guidesSchema = z.strictObject({ x: line, y: line });

export { guidesSchema };
