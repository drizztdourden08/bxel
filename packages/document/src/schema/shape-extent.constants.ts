/* @layer core @kind constants */
import { z } from 'zod';
import { MAX_SPRITE_SIZE } from '../model/limits.constants';

const COORDINATE_SCHEMA = z.number().int().min(0).max(MAX_SPRITE_SIZE);

const EXTENT_SCHEMA = z.number().int().min(1).max(MAX_SPRITE_SIZE);

const isHalf = (value: number): boolean => Number.isInteger(value * 2);

const HALF_COORDINATE_SCHEMA = z.number().min(0).max(MAX_SPRITE_SIZE).refine(isHalf, 'A shape coordinate is a whole or half pixel.');

const HALF_EXTENT_SCHEMA = z.number().min(0.5).max(MAX_SPRITE_SIZE).refine(isHalf, 'A shape size is a whole or half pixel.');

const HALF_POINT_SCHEMA = z.object({ x: HALF_COORDINATE_SCHEMA, y: HALF_COORDINATE_SCHEMA });

export { COORDINATE_SCHEMA, EXTENT_SCHEMA, HALF_COORDINATE_SCHEMA, HALF_EXTENT_SCHEMA, HALF_POINT_SCHEMA };
