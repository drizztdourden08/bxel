/* @layer core @kind logic */
import { z } from 'zod';
import { TARGET_SCOPE_SCHEMA } from '../schema/changes.constants';
import { DOCUMENT_ID_SCHEMA, FRAME_ID_SCHEMA, LAYER_ID_SCHEMA, REVISION_SCHEMA, SPRITE_ID_SCHEMA } from '../schema/ids.constants';
import { COUNT_SCHEMA, INDEXES_SCHEMA, RECT_SCHEMA } from '../schema/shapes.constants';
import { withFailure } from '../schema/with-failure';
import { defineTool } from './define-tool';
import { TOOL_NAME } from './tool-name.constants';

const step = z.strictObject({
  name: z.literal('pixels.patch'),
  targets: TARGET_SCOPE_SCHEMA,
  options: z.strictObject({ rect: RECT_SCHEMA, pixels: INDEXES_SCHEMA, skipZero: z.literal(true) }),
});

const antiAliasTool = defineTool(TOOL_NAME.antiAlias, {
  title: 'Propose anti aliasing',
  description:
    'Proposes anti aliasing for the flattened frame of a sprite, the way the Anti alias command does: at each corner of a run of two or more pixels in the edge colour, one pixel in the mid colour softens the step. Nothing is changed. The result is a pixels.patch step for the layer you name: pass it to preview_edits to look at it, then to apply_edits to keep it. Zero pixels in the patch are skipped (skipZero), so only the corners change. Pass edge and, when the palette has no ramp step to use, mid.',
  input: z.strictObject({
    documentId: DOCUMENT_ID_SCHEMA,
    spriteId: SPRITE_ID_SCHEMA,
    frameId: FRAME_ID_SCHEMA.optional().describe('Default: the first frame.'),
    layerId: LAYER_ID_SCHEMA.describe('The layer the patch is written to.'),
    edge: COUNT_SCHEMA.describe('The palette index of the form whose edges get softened.'),
    mid: COUNT_SCHEMA.optional().describe('The palette index laid at the corners. Default: the next step of the ramp that holds edge, or the previous one.'),
    inside: z.boolean().default(true).describe('True softens corners on the sprite, over its own pixels. False lays the mid colour on the transparent pixels around it.'),
  }),
  output: withFailure({
    revision: REVISION_SCHEMA,
    spriteId: SPRITE_ID_SCHEMA,
    frameId: FRAME_ID_SCHEMA,
    edge: COUNT_SCHEMA,
    mid: COUNT_SCHEMA,
    changed: COUNT_SCHEMA.describe('How many pixels the proposal sets. 0 means there is nothing to soften.'),
    step: step.nullable().describe('The step to hand to preview_edits and apply_edits. Null when changed is 0.'),
  }),
});

export { antiAliasTool };
