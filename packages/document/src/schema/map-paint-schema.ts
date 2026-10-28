/* @layer core @kind logic */
import { z } from 'zod';
import { cellFlagsSchema } from './cell-flags-schema';
import { hasOnePlacement } from './has-one-placement';
import { mapPlaceFields } from './map-place-fields';
import { PLACEMENT_MESSAGE } from './map-place.constants';
import { mapRandomSchema } from './map-random-schema';
import { tileRefSchema } from './tile-ref-schema';

const mapPaintSchema = z
  .strictObject({ ...mapPlaceFields, tile: tileRefSchema.optional(), random: mapRandomSchema.optional(), flags: cellFlagsSchema })
  .refine(hasOnePlacement, { message: PLACEMENT_MESSAGE })
  .refine((options) => (options.tile === undefined) !== (options.random === undefined), {
    message: 'Give one tile, or random with a list of tiles and a seed.',
    path: ['tile'],
  });

export { mapPaintSchema };
