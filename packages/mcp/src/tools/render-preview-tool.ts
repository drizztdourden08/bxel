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
  TILESET_ID_SCHEMA,
} from '../schema/ids.constants';
import { COUNT_SCHEMA, SHA256_SCHEMA } from '../schema/shapes.constants';
import { withFailure } from '../schema/with-failure';
import { defineTool } from './define-tool';
import { TOOL_NAME } from './tool-name.constants';

const FACING_VALUES = ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'] as const;

const spriteTarget = z.strictObject({ spriteId: SPRITE_ID_SCHEMA, frameId: FRAME_ID_SCHEMA.optional() });
const sheetTarget = z.strictObject({ sheetId: SHEET_ID_SCHEMA });
const tilesetTarget = z.strictObject({
  tilesetId: TILESET_ID_SCHEMA,
  overlay: z.enum(['none', 'collision']).default('none').describe('collision tints the shapes of every tile by layer.'),
});
const animationTarget = z
  .strictObject({
    animationId: ANIMATION_ID_SCHEMA,
    frameId: ANIM_FRAME_ID_SCHEMA.optional().describe('Draw this one frame, composed on the animation canvas.'),
    tagId: TAG_ID_SCHEMA.optional().describe('Draw the frames of this tag in play order as a strip, left to right.'),
    facing: z.enum(FACING_VALUES).optional().describe('Draw the tag that plays this facing in play order. A mirror tag draws its frames flipped.'),
    allFacings: z.boolean().optional().describe('Draw one row per facing of the animation, each a strip of its tag in play order.'),
  })
  .refine((target) => [target.frameId, target.tagId, target.facing, target.allFacings].filter((each) => each !== undefined).length <= 1, {
    message: 'Give one of a frame, a tag, a facing or allFacings.',
  });

const renderPreviewTool = defineTool(TOOL_NAME.renderPreview, {
  title: 'Render a preview',
  description:
    'A PNG of one sprite frame, one tileset laid out in its columns (holes shown dim, optional collision overlay), one animation frame (with onion true, with its onion skin ghosts), a strip of an animation (the whole animation, the frames of one tag or one facing, in play order, mirrors flipped), a grid with one row per facing (allFacings) or one sheet, drawn by the same code as the canvas and the export. With animated gif or apng an animation play comes back as an animated image to judge the timing. Nearest-neighbour scale only. The image is returned as an image block and a resource link.',
  input: z.strictObject({
    documentId: DOCUMENT_ID_SCHEMA,
    target: z.union([spriteTarget, animationTarget, sheetTarget, tilesetTarget]),
    scale: z.number().int().min(1).max(16).default(4),
    background: z.enum(['transparent', 'checker']).default('transparent'),
    grid: z.boolean().default(false),
    onion: z.boolean().default(false).describe('Animation frame only: draw the frame with its onion skin ghosts as the canvas draws them, using the timeline onion settings from get_view with the onion switched on.'),
    animated: z.enum(['gif', 'apng']).optional().describe('Animation tag, facing or whole animation: return the play as a GIF or an APNG, with the frame times, instead of a still strip.'),
  }),
  output: withFailure({
    revision: REVISION_SCHEMA,
    width: COUNT_SCHEMA,
    height: COUNT_SCHEMA,
    scale: COUNT_SCHEMA,
    indexHash: SHA256_SCHEMA,
    uri: z.string(),
    mimeType: z.enum(['image/png', 'image/gif', 'image/apng']).optional().describe('The type of the image block. Absent means image/png.'),
    frames: COUNT_SCHEMA.optional().describe('Animated: the number of frames in the file.'),
    totalMs: COUNT_SCHEMA.optional().describe('Animated: the duration of one pass.'),
    rows: z.array(z.strictObject({ facing: z.enum(FACING_VALUES), tagId: TAG_ID_SCHEMA })).optional().describe('allFacings: the facing of each row from the top, with its tag.'),
  }),
});

export { renderPreviewTool };
