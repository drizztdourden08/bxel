/* @layer core @kind logic */
import { z } from 'zod';
import { BANK_ID_SCHEMA, DOCUMENT_ID_SCHEMA, REVISION_SCHEMA, SPRITE_ID_SCHEMA } from '../schema/ids.constants';
import { idSchemaOf } from '../schema/id-schema-of';
import { COUNT_SCHEMA, HEX_COLOR_SCHEMA } from '../schema/shapes.constants';
import { withFailure } from '../schema/with-failure';
import { defineTool } from './define-tool';
import { TOOL_NAME } from './tool-name.constants';

const slot = z.strictObject({
  index: COUNT_SCHEMA,
  swatchId: idSchemaOf('sw'),
  hex: HEX_COLOR_SCHEMA.nullable(),
  alpha: z.number().int().min(0).max(255).describe('0 is clear and 255 is solid. A missing alpha in the file reads as 255.'),
  name: z.string(),
});

const ramp = z.strictObject({
  rampId: idSchemaOf('rmp'),
  name: z.string(),
  indexes: z.array(COUNT_SCHEMA),
});

const use = z.strictObject({
  index: COUNT_SCHEMA,
  pixels: COUNT_SCHEMA,
  frames: COUNT_SCHEMA,
});

const sharing = z.strictObject({
  shared: z.boolean(),
  sprites: z.array(z.strictObject({ spriteId: SPRITE_ID_SCHEMA, name: z.string() })),
});

const readPaletteTool = defineTool(TOOL_NAME.readPalette, {
  title: 'Read a palette',
  description: 'One bank with its slots in index order. Index 0 of a transparent bank has hex null and alpha 0. A colour has an alpha from 0 to 255.',
  input: z.strictObject({
    documentId: DOCUMENT_ID_SCHEMA,
    bankId: BANK_ID_SCHEMA.optional().describe("Default: the artwork's default bank."),
    include: z
      .array(z.enum(['usage', 'duplicates', 'sharing']))
      .optional()
      .describe('usage: pixels and frames per slot over every sprite on the bank. duplicates: groups of slot indexes with the same colour and alpha. sharing: the sprites that use the bank.'),
  }),
  output: withFailure({
    revision: REVISION_SCHEMA,
    bankId: BANK_ID_SCHEMA,
    name: z.string(),
    cap: COUNT_SCHEMA,
    transparent: z.boolean(),
    slots: z.array(slot),
    ramps: z.array(ramp),
    usage: z.array(use).optional(),
    duplicates: z.array(z.array(COUNT_SCHEMA)).optional(),
    sharing: sharing.optional(),
  }),
});

export { readPaletteTool };
