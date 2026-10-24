/* @layer core @kind logic */
import { z } from 'zod';
import { MAX_TILE_KEY } from './tileset-schema.constants';

const tileKeySchema = z.number().int().min(0).max(MAX_TILE_KEY);

export { tileKeySchema };
