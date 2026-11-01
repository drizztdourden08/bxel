/* @layer core @kind logic */
import { z } from 'zod';
import { BANK_ID_SCHEMA, DOCUMENT_ID_SCHEMA, REVISION_SCHEMA } from '../schema/ids.constants';
import { LOCATION_SCHEMA } from '../schema/place.constants';
import { COUNT_SCHEMA } from '../schema/shapes.constants';
import { withFailure } from '../schema/with-failure';
import { defineTool } from './define-tool';
import { PALETTE_IMPORT_MODE_VALUES } from './tool-enums.constants';
import { TOOL_NAME } from './tool-name.constants';

const importPaletteTool = defineTool(TOOL_NAME.importPalette, {
  title: 'Import a palette file into a bank',
  description:
    'Reads a gpl, pal, hex, txt, ase or png palette file from a granted project and puts its colours into an existing bank of the document, as one undo step. Modes: append adds the colours the bank does not have yet while there is room; replace swaps every colour for the file colours and keeps the pixels on their slot index; map swaps the colours and moves each pixel to the file colour closest to its old one. Colours that do not fit are counted in over and left out. To make a new bank from a palette file, use import_files instead.',
  input: z.strictObject({
    documentId: DOCUMENT_ID_SCHEMA,
    expectedRevision: REVISION_SCHEMA.optional(),
    bankId: BANK_ID_SCHEMA.optional().describe("Default: the artwork's default bank."),
    file: LOCATION_SCHEMA.describe('A palette file (gpl, pal, hex, txt, ase or png) in a project granted to the assistant.'),
    mode: z.enum(PALETTE_IMPORT_MODE_VALUES).default('append'),
  }),
  output: withFailure({
    revision: REVISION_SCHEMA,
    bankId: BANK_ID_SCHEMA,
    mode: z.enum(PALETTE_IMPORT_MODE_VALUES),
    added: COUNT_SCHEMA.describe('The colours that went into the bank.'),
    present: COUNT_SCHEMA.describe('The file colours the bank already had (append leaves them out).'),
    over: COUNT_SCHEMA.describe('The colours that did not fit the bank cap.'),
  }),
});

export { importPaletteTool };
