/* @layer core @kind logic */
import { z } from 'zod';
import { MAX_SPRITE_SIZE } from '../model/limits.constants';

const offsetSchema = z.number().int().min(-MAX_SPRITE_SIZE).max(MAX_SPRITE_SIZE);

const layerReferenceSchema = z.object({ path: z.string().min(1).max(4096), x: offsetSchema, y: offsetSchema });

export { layerReferenceSchema };
