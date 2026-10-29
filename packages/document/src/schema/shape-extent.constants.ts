/* @layer core @kind constants */
import { z } from 'zod';
import { MAX_SPRITE_SIZE } from '../model/limits.constants';

const COORDINATE_SCHEMA = z.number().int().min(0).max(MAX_SPRITE_SIZE);

const EXTENT_SCHEMA = z.number().int().min(1).max(MAX_SPRITE_SIZE);

export { COORDINATE_SCHEMA, EXTENT_SCHEMA };
