/* @layer core @kind logic */
import { z } from 'zod';
import { EXPORT_FILES_SCHEMA } from '../schema/export-files.constants';
import { exportInput } from '../schema/export-input';
import { BANK_ID_SCHEMA, DOCUMENT_ID_SCHEMA, REVISION_SCHEMA } from '../schema/ids.constants';
import { COUNT_SCHEMA } from '../schema/shapes.constants';
import { withFailure } from '../schema/with-failure';
import { defineTool } from './define-tool';
import { PALETTE_EXPORT_FORMAT_VALUES } from './tool-enums.constants';
import { TOOL_NAME } from './tool-name.constants';

const base = {
  documentId: DOCUMENT_ID_SCHEMA,
  expectedRevision: REVISION_SCHEMA.optional(),
  bankId: BANK_ID_SCHEMA.optional().describe("Default: the artwork's default bank."),
  indexes: z.array(COUNT_SCHEMA).min(1).max(256).optional().describe('Only these slot indexes. Default: every colour of the bank.'),
  format: z.enum(PALETTE_EXPORT_FORMAT_VALUES),
  scale: z.number().int().min(1).max(32).default(1).describe('Only for format png: the size of one swatch in pixels.'),
  overwrite: z.boolean().default(false),
};

const exportPaletteTool = defineTool(TOOL_NAME.exportPalette, {
  title: 'Export a palette',
  description:
    'Writes one palette bank, or only some of its slots, as a palette file at a frozen revision, into a project granted editing or the assistant folder. Formats: gpl (GIMP), pal (JASC), hex (Lospec hex list), txt (Paint.net), ase (Adobe swatches) and png (a one row strip, one swatch per colour, scaled by scale). The transparent slot has no colour and is left out. The file name must end in the format name, .png for png. Give exactly one of location and fileName. Exports stay off the recent files list.',
  input: exportInput(base),
  output: withFailure({
    revision: REVISION_SCHEMA,
    bankId: BANK_ID_SCHEMA,
    colors: COUNT_SCHEMA,
    files: EXPORT_FILES_SCHEMA,
  }),
});

export { exportPaletteTool };
