/* @layer core @kind logic */
import { z } from 'zod';
import { ROTATE_ALGORITHMS } from '../../resample/resample.constants';
import { ALGORITHM_HELP } from './algorithm-schema.constants';

const rotateAlgorithmSchema = z.enum(ROTATE_ALGORITHMS).default('nearest').describe(ALGORITHM_HELP);

export { rotateAlgorithmSchema };
