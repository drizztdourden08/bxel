/* @layer core @kind logic */
import { z } from 'zod';
import { GUIDE_STEP, MAX_SPRITE_SIZE } from '../model/limits.constants';

const guidePositionSchema = z.number().min(0).max(MAX_SPRITE_SIZE).multipleOf(GUIDE_STEP);

export { guidePositionSchema };
