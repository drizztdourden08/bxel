/* @layer core @kind logic */
import { z } from 'zod';
import { locationPathSchema } from './location-path-schema';

const rolePathSchema = locationPathSchema(true).optional();

const rolesSchema = z.strictObject({
  sprites: rolePathSchema,
  animations: rolePathSchema,
  sheets: rolePathSchema,
  palettes: rolePathSchema,
  tilemaps: rolePathSchema,
  exports: rolePathSchema,
});

export { rolesSchema };
