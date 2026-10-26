/* @layer core @kind logic */
import { z } from 'zod';
import {
  ANIM_FRAME_ID_SCHEMA,
  ANIMATION_ID_SCHEMA,
  DOCUMENT_ID_SCHEMA,
  FRAME_ID_SCHEMA,
  REVISION_SCHEMA,
  SHEET_ID_SCHEMA,
  SPRITE_ID_SCHEMA,
  TAG_ID_SCHEMA,
} from '../schema/ids.constants';
import { COUNT_SCHEMA, SHA256_SCHEMA } from '../schema/shapes.constants';
import { withFailure } from '../schema/with-failure';
import { defineTool } from './define-tool';
import { TOOL_NAME } from './tool-name.constants';

const spriteTarget = z.strictObject({ spriteId: SPRITE_ID_SCHEMA, frameId: FRAME_ID_SCHEMA.optional() });
const sheetTarget = z.strictObject({ sheetId: SHEET_ID_SCHEMA });
const animationTarget = z
  .strictObject({
    animationId: ANIMATION_ID_SCHEMA,
    frameId: ANIM_FRAME_ID_SCHEMA.optional().describe('Draw this one frame, composed on the animation canvas.'),
    tagId: TAG_ID_SCHEMA.optional().describe('Draw the frames of this tag in play order as a strip, left to right.'),
  })
  .refine((target) => target.frameId === undefined || target.tagId === undefined, { message: 'Give a frame or a tag, not both.' });

const renderPreviewTool = defineTool(TOOL_NAME.renderPreview, {
  title: 'Render a preview',
  description:
    'A PNG of one sprite frame, one animation frame, a strip of an animation (the whole animation, or the frames of one tag, in play order) or one sheet, drawn by the same code as the canvas and the export. Nearest-neighbour scale only. The image is returned as an image block and a resource link.',
  input: z.strictObject({
    documentId: DOCUMENT_ID_SCHEMA,
    target: z.union([spriteTarget, animationTarget, sheetTarget]),
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
