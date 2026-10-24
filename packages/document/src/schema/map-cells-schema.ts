/* @layer core @kind logic */
import { z } from 'zod';
import { MAX_POINTS } from '../model/limits.constants';
import { pointSchema } from './point-schema';

const mapCellsSchema = z.array(pointSchema).min(1).max(MAX_POINTS);

export { mapCellsSchema };
