/* @layer core @kind logic */
import { z } from 'zod';
import { cellFlagsSchema } from './cell-flags-schema';
import { hasOnePlacement } from './has-one-placement';
import { mapPlaceFields } from './map-place-fields';
import { PLACEMENT_MESSAGE } from './map-place.constants';
import { tileRefSchema } from './tile-ref-schema';

const mapPaintSchema = z
  .strictObject({ ...mapPlaceFields, tile: tileRefSchema, flags: cellFlagsSchema })
  .refine(hasOnePlacement, { message: PLACEMENT_MESSAGE });

export { mapPaintSchema };
