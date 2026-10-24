/* @layer core @kind logic */
import { z } from 'zod';
import { hasOnePlacement } from './has-one-placement';
import { mapPlaceFields } from './map-place-fields';
import { PLACEMENT_MESSAGE } from './map-place.constants';

const mapEraseSchema = z.strictObject(mapPlaceFields).refine(hasOnePlacement, { message: PLACEMENT_MESSAGE });

export { mapEraseSchema };
