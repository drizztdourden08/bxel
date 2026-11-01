/* @layer core @kind logic */
import { z } from 'zod';
import { FULL_VIEW_OPACITY } from '../model/layer-lock.constants';

const opacitySchema = z.number().int().min(0).max(FULL_VIEW_OPACITY);

export { opacitySchema };
