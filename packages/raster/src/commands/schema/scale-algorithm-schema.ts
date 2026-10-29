/* @layer core @kind logic */
import { z } from 'zod';
import { SCALE_ALGORITHMS } from '../../resample/resample.constants';
import { ALGORITHM_HELP } from './algorithm-schema.constants';

const scaleAlgorithmSchema = z.enum(SCALE_ALGORITHMS).default('nearest').describe(ALGORITHM_HELP);

export { scaleAlgorithmSchema };
