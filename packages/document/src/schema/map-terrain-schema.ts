/* @layer core @kind logic */
import { z } from 'zod';
import { hasOnePlacement } from './has-one-placement';
import { mapPlaceFields } from './map-place-fields';
import { PLACEMENT_MESSAGE } from './map-place.constants';

const mapTerrainSchema = z
  .strictObject({ ...mapPlaceFields, mode: z.enum(['paint', 'erase']) })
  .refine(hasOnePlacement, { message: PLACEMENT_MESSAGE });

export { mapTerrainSchema };
