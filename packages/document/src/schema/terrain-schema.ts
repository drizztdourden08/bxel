/* @layer core @kind logic */
import { z } from 'zod';
import { TERRAIN_KINDS, TERRAIN_SLOTS } from '../terrain/terrain.constants';
import { tileKeySchema } from './tile-key-schema';

const terrainSchema = z
  .strictObject({ kind: z.enum(TERRAIN_KINDS), keys: z.array(tileKeySchema).max(TERRAIN_SLOTS.blob47) })
  .refine((rules) => rules.keys.length === TERRAIN_SLOTS[rules.kind], { message: 'A terrain rule set holds one tile key per slot.' });

export { terrainSchema };
