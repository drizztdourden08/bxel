/* @layer core @kind logic */
import { z } from 'zod';
import { BANK_ID_SCHEMA, DOCUMENT_ID_SCHEMA, REVISION_SCHEMA } from '../schema/ids.constants';
import { idSchemaOf } from '../schema/id-schema-of';
import { COUNT_SCHEMA, HEX_COLOR_SCHEMA } from '../schema/shapes.constants';
import { withFailure } from '../schema/with-failure';
import { defineTool } from './define-tool';
import { TOOL_NAME } from './tool-name.constants';

const slot = z.strictObject({
  index: COUNT_SCHEMA,
  swatchId: idSchemaOf('sw'),
  hex: HEX_COLOR_SCHEMA.nullable(),
  name: z.string(),
});

const ramp = z.strictObject({
  rampId: idSchemaOf('rmp'),
  name: z.string(),
  indexes: z.array(COUNT_SCHEMA),
});

const readPaletteTool = defineTool(TOOL_NAME.readPalette, {
  title: 'Read a palette',
  description: 'One bank with its slots in index order. Index 0 of a transparent bank has hex null.',
  input: z.strictObject({
    documentId: DOCUMENT_ID_SCHEMA,
    bankId: BANK_ID_SCHEMA.optional().describe("Default: the artwork's default bank."),
  }),
  output: withFailure({
    revision: REVISION_SCHEMA,
    bankId: BANK_ID_SCHEMA,
    name: z.string(),
    cap: COUNT_SCHEMA,
    transparent: z.boolean(),
    slots: z.array(slot),
    ramps: z.array(ramp),
  }),
});

export { readPaletteTool };
