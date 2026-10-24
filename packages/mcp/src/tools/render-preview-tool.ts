/* @layer core @kind logic */
import { z } from 'zod';
import { DOCUMENT_ID_SCHEMA, FRAME_ID_SCHEMA, REVISION_SCHEMA, SHEET_ID_SCHEMA, SPRITE_ID_SCHEMA } from '../schema/ids.constants';
import { COUNT_SCHEMA, SHA256_SCHEMA } from '../schema/shapes.constants';
import { withFailure } from '../schema/with-failure';
import { defineTool } from './define-tool';
import { TOOL_NAME } from './tool-name.constants';

const spriteTarget = z.strictObject({ spriteId: SPRITE_ID_SCHEMA, frameId: FRAME_ID_SCHEMA.optional() });
const sheetTarget = z.strictObject({ sheetId: SHEET_ID_SCHEMA });

const renderPreviewTool = defineTool(TOOL_NAME.renderPreview, {
  title: 'Render a preview',
  description:
    'A PNG of one sprite frame or one sheet, drawn by the same code as the canvas and the export. Nearest-neighbour scale only. The image is returned as an image block and a resource link.',
  input: z.strictObject({
    documentId: DOCUMENT_ID_SCHEMA,
    target: z.union([spriteTarget, sheetTarget]),
    scale: z.number().int().min(1).max(16).default(4),
    background: z.enum(['transparent', 'checker']).default('transparent'),
    grid: z.boolean().default(false),
  }),
  output: withFailure({
    revision: REVISION_SCHEMA,
    width: COUNT_SCHEMA,
    height: COUNT_SCHEMA,
    scale: COUNT_SCHEMA,
    indexHash: SHA256_SCHEMA,
    uri: z.string(),
  }),
});

export { renderPreviewTool };
