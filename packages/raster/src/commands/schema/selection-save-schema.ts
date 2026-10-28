/* @layer core @kind logic */
import { z } from 'zod';
import { requiredMaskSchema } from './required-mask-schema';

const selectionNameSchema = z.string().min(1).max(64);

const selectionSaveSchema = z.strictObject({
  name: selectionNameSchema.describe('The name to keep the selection under. An existing selection of that name is replaced.'),
  mask: requiredMaskSchema.describe('The selection, as wide and as tall as the sprite.'),
});

const selectionDeleteSchema = z.strictObject({ name: selectionNameSchema });

export { selectionDeleteSchema, selectionSaveSchema };
