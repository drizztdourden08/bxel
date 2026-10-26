/* @layer core @kind logic */
import { z } from 'zod';
import { MIN_ALPHA, OPAQUE_ALPHA } from '../model/transparent.constants';

const alphaSchema = z.number().int().min(MIN_ALPHA).max(OPAQUE_ALPHA);

export { alphaSchema };
