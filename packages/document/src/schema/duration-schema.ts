/* @layer core @kind logic */
import { z } from 'zod';
import { MAX_DURATION_MS, MIN_DURATION_MS } from '../model/limits.constants';

const durationSchema = z.number().int().min(MIN_DURATION_MS).max(MAX_DURATION_MS);

export { durationSchema };
