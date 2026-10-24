/* @layer core @kind constants */
import { COMMAND_NAME } from '@bxel/document';
import { z } from 'zod';
import { INDEXES_SCHEMA, RECT_SCHEMA } from './shapes.constants';

const PIXELS_PATCH_WIRE_SCHEMA = z.strictObject({
  rect: RECT_SCHEMA,
  pixels: INDEXES_SCHEMA,
  skipZero: z.boolean().default(false),
});

const WIRE_OPTIONS: ReadonlyMap<string, z.ZodType> = new Map<string, z.ZodType>([
  [COMMAND_NAME.pixelsPatch, PIXELS_PATCH_WIRE_SCHEMA],
]);

export { PIXELS_PATCH_WIRE_SCHEMA, WIRE_OPTIONS };
