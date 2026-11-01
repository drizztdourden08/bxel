/* @layer core @kind logic */
import { z } from 'zod';
import { BANK_ID_SCHEMA, DOCUMENT_ID_SCHEMA, REVISION_SCHEMA } from '../schema/ids.constants';
import { COUNT_SCHEMA, HEX_COLOR_SCHEMA } from '../schema/shapes.constants';
import { withFailure } from '../schema/with-failure';
import { defineTool } from './define-tool';
import { TOOL_NAME } from './tool-name.constants';

const step = z.strictObject({
  offset: z.number().int().describe('0 is the base colour, negative steps are darker and positive steps are lighter.'),
  hex: HEX_COLOR_SCHEMA,
  reuses: COUNT_SCHEMA.nullable().describe('The slot index of an existing swatch this step snaps to, or null when the step is a new colour.'),
});

const buildRampTool = defineTool(TOOL_NAME.buildRamp, {
  title: 'Build a ramp',
  description:
    'Proposes the colours of a ramp around a base colour, the way the ramp builder does: darker and lighter steps in OKLCH with a hue shift, snapped to swatches the palette already has when they are close. Nothing is changed. Add the new colours with swatch commands and group them with ramp.add through apply_edits.',
  input: z.strictObject({
    documentId: DOCUMENT_ID_SCHEMA,
    bankId: BANK_ID_SCHEMA.optional().describe("Default: the artwork's default bank."),
    base: HEX_COLOR_SCHEMA,
    baseIndex: COUNT_SCHEMA.optional().describe('The slot of the base colour when it is already a swatch, so it is reused and never duplicated.'),
    dark: z.number().int().min(0).max(8).default(3),
    light: z.number().int().min(0).max(8).default(3),
    hueShift: z.number().min(0).max(45).default(15).describe('Degrees the hue turns towards cool in the shadows and warm in the lights.'),
    hueMode: z.enum(['shift', 'straight']).default('shift'),
    chromaCurve: z.boolean().default(true),
    snap: z.number().min(0).max(0.2).default(0.03).describe('How close an existing swatch must be to be reused. 0 reuses nothing.'),
  }),
  output: withFailure({
    revision: REVISION_SCHEMA,
    bankId: BANK_ID_SCHEMA,
    steps: z.array(step),
    added: COUNT_SCHEMA.describe('How many steps are new colours.'),
    free: COUNT_SCHEMA.describe('How many free slots the palette has under its colour limit.'),
  }),
});

export { buildRampTool };
