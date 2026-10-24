/* @layer core @kind logic */
import { z } from 'zod';
import { locationSchema } from './location-schema';

const settingsSchema = z.strictObject({
  newFiles: locationSchema(true),
  exports: locationSchema(true),
  palette: locationSchema(false).nullable(),
});

export { settingsSchema };
