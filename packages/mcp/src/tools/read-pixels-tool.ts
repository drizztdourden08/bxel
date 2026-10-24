/* @layer core @kind logic */
import { z } from 'zod';
import { READ_PIXELS_MAX } from '../limits/limits.constants';
import {
  DOCUMENT_ID_SCHEMA,
  FRAME_ID_SCHEMA,
  LAYER_ID_SCHEMA,
  REVISION_SCHEMA,
  SPRITE_ID_SCHEMA,
} from '../schema/ids.constants';
import { COUNT_SCHEMA, INDEXES_SCHEMA, RECT_SCHEMA, SHA256_SCHEMA } from '../schema/shapes.constants';
import { withFailure } from '../schema/with-failure';
import { defineTool } from './define-tool';
import { TOOL_NAME } from './tool-name.constants';

const readPixelsTool = defineTool(TOOL_NAME.readPixels, {
  title: 'Read pixels',
  description:
    'A bounded rectangle of palette indexes from one layer or from the flattened frame (the topmost non-zero index wins). The area limit equals a patch, so a read can be edited and written back in one step.',
  input: z
    .strictObject({
      documentId: DOCUMENT_ID_SCHEMA,
      spriteId: SPRITE_ID_SCHEMA,
      frameId: FRAME_ID_SCHEMA,
      layer: z.union([z.literal('flattened'), z.strictObject({ layerId: LAYER_ID_SCHEMA })]),
      rect: RECT_SCHEMA.describe('Inside the sprite; width * height must be at most 65536.'),
    })
    .refine((value) => value.rect.width * value.rect.height <= READ_PIXELS_MAX, {
      path: ['rect'],
      message: `width * height must be at most ${READ_PIXELS_MAX}.`,
    }),
  output: withFailure({
    revision: REVISION_SCHEMA,
    rect: RECT_SCHEMA,
    encoding: z.literal('u8-rowmajor-base64'),
    pixels: INDEXES_SCHEMA,
    indexHash: SHA256_SCHEMA,
    colorUse: z.array(z.array(COUNT_SCHEMA).length(2)).describe('Index and count pairs for the indexes present.'),
  }),
});

export { readPixelsTool };
