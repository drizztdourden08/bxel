/* @layer core @kind logic */
import { z } from 'zod';
import { requiredMaskSchema } from './required-mask-schema';
import { selectionNameSchema } from './selection-name-schema';

const selectionSaveSchema = z.strictObject({
  name: selectionNameSchema.describe('The name to keep the selection under. An existing selection of that name is replaced.'),
  mask: requiredMaskSchema.describe('The selection, as wide and as tall as the sprite.'),
});

export { selectionSaveSchema };
