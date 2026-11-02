/* @layer core @kind logic */
import { z } from 'zod';
import {
  ANIM_FRAME_ID_SCHEMA,
  ANIMATION_ID_SCHEMA,
  BANK_ID_SCHEMA,
  DOCUMENT_ID_SCHEMA,
  FRAME_ID_SCHEMA,
  LAYER_ID_SCHEMA,
  REVISION_SCHEMA,
  SHEET_ID_SCHEMA,
  SPRITE_ID_SCHEMA,
  TAG_ID_SCHEMA,
  MAP_LAYER_ID_SCHEMA,
  TILEMAP_ID_SCHEMA,
  TILESET_ID_SCHEMA,
} from '../schema/ids.constants';
import { LOCATION_SCHEMA } from '../schema/place.constants';
import { COUNT_SCHEMA, SHA256_SCHEMA } from '../schema/shapes.constants';
import { withFailure } from '../schema/with-failure';
import { defineTool } from './define-tool';
import { FACING_SCHEMA } from './get-animation-tool.constants';
import { TOOL_NAME } from './tool-name.constants';

const spriteTarget = z.strictObject({ spriteId: SPRITE_ID_SCHEMA, frameId: FRAME_ID_SCHEMA.optional() });
const sheetTarget = z.strictObject({ sheetId: SHEET_ID_SCHEMA });
const tilesetTarget = z.strictObject({
  tilesetId: TILESET_ID_SCHEMA,
  overlay: z
    .enum(['none', 'collision', 'terrain', 'keys'])
    .default('none')
    .describe('collision tints the shapes of every tile by layer. terrain tints the tiles of each terrain set in its own colour. keys writes the key number of every tile in its corner.'),
});
const tilemapTarget = z.strictObject({
  tilemapId: TILEMAP_ID_SCHEMA,
  layerId: MAP_LAYER_ID_SCHEMA.optional().describe('Draw this one layer, shown even when hidden. Absent draws every visible layer.'),
});
const animationTarget = z
  .strictObject({
    animationId: ANIMATION_ID_SCHEMA,
    frameId: ANIM_FRAME_ID_SCHEMA.optional().describe('Draw this one frame, composed on the animation canvas.'),
    tagId: TAG_ID_SCHEMA.optional().describe('Draw the frames of this tag in play order as a strip, left to right.'),
    facing: FACING_SCHEMA.optional().describe('Draw the tag that plays this facing in play order. A mirror tag draws its frames flipped.'),
    allFacings: z.boolean().optional().describe('Draw one row per facing of the animation, each a strip of its tag in play order.'),
  })
  .refine((target) => [target.frameId, target.tagId, target.facing, target.allFacings].filter((each) => each !== undefined).length <= 1, {
    message: 'Give one of a frame, a tag, a facing or allFacings.',
  });

const OVERLAY_VALUES = ['grid', 'major', 'tile', 'guides', 'selection', 'onion', 'collision'] as const;

const renderPreviewTool = defineTool(TOOL_NAME.renderPreview, {
  title: 'Render a preview',
  description:
    'A PNG of one sprite frame (every visible layer, or only the layers named in layers), one tileset laid out in its columns (holes shown dim, optional collision, terrain or tile key overlay), one tilemap (every visible layer, or only the layers named in layers), one animation frame (with onion true, with its onion skin ghosts), a strip of an animation (the whole animation, the frames of one tag or one facing, in play order, mirrors flipped), a grid with one row per facing (allFacings) or one sheet, drawn by the same code as the canvas and the export (a sheet with exported true is drawn as the exporter packs it). With animated gif or apng an animation play comes back as an animated image to judge the timing. Nearest-neighbour scale only. The image is returned as an image block and a resource link.',
  input: z
    .strictObject({
    documentId: DOCUMENT_ID_SCHEMA.optional(),
    target: z.union([spriteTarget, animationTarget, sheetTarget, tilesetTarget, tilemapTarget]).optional(),
    file: LOCATION_SCHEMA.optional().describe('A file that is not open: its place (projectId, folderId, path). Gives the thumbnail the browser shows, an image or a native file, without opening it. Give this or a documentId with a target.'),
    scale: z.number().int().min(1).max(16).default(4),
    background: z.enum(['transparent', 'checker']).default('transparent'),
    grid: z.boolean().default(false),
    exported: z
      .boolean()
      .default(false)
      .describe('A sheet target only: draw the sheet as the exporter packs it (grid or packed layout, spacing, margin; the first page when there are several) instead of the default sheet image.'),
    onion: z.boolean().default(false).describe('Animation frame only: draw the frame with its onion skin ghosts as the canvas draws them, using the timeline onion settings from get_view with the onion switched on.'),
    bankId: BANK_ID_SCHEMA.optional().describe('Sprite frame only: draw the frame through this other palette, as the Preview with command does. Nothing is saved. The palette needs at least as many swatches as the sprite palette.'),
    layers: z
      .array(z.union([LAYER_ID_SCHEMA, MAP_LAYER_ID_SCHEMA]))
      .min(1)
      .max(64)
      .optional()
      .describe('Sprite frame or tilemap target only: draw only these layers, shown even when hidden. A group names every layer inside it. Sprite layer ids for a sprite, map layer ids for a tilemap. Absent draws every visible layer.'),
    overlays: z
      .array(z.enum(OVERLAY_VALUES))
      .max(OVERLAY_VALUES.length)
      .optional()
      .describe('Draw these view overlays as the canvas does. grid is the pixel grid (scale 4 or more), major every 8th line, tile the 16 pixel tile grid, guides the guides of the sprite, selection the outline of the selection of the open sprite, onion the onion skin ghosts of an animation frame, collision the collision shapes of a tileset. An overlay that does not fit the target comes back in overlays.ignored.'),
    view: z.boolean().default(false).describe('Crop the image to the rectangle the owner sees at the current zoom and pan (get_view zoom.visible), when the document is the active one.'),
    mirror: z.boolean().default(false).describe('Flip the image left to right, as the Mirrored view does. The pixels never change.'),
    animated: z.enum(['gif', 'apng']).optional().describe('Animation tag, facing or whole animation: return the play as a GIF or an APNG, with the frame times, instead of a still strip.'),
    })
    .refine((input) => (input.file !== undefined) !== (input.documentId !== undefined && input.target !== undefined), {
      message: 'Give a file, or a documentId with a target.',
    })
    .refine((input) => input.layers === undefined || (input.target !== undefined && ('spriteId' in input.target || 'tilemapId' in input.target)), {
      message: 'layers needs a sprite or a tilemap target.',
      path: ['layers'],
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
    overlays: z
      .strictObject({ applied: z.array(z.enum(OVERLAY_VALUES)), ignored: z.array(z.enum(OVERLAY_VALUES)) })
      .optional()
      .describe('Present when overlays were asked: the ones drawn and the ones that do not fit the target.'),
    mirrored: z.boolean().optional().describe('True when the image was flipped left to right.'),
    cropped: z.strictObject({ x: z.number().int(), y: z.number().int(), width: COUNT_SCHEMA, height: COUNT_SCHEMA }).optional().describe('The rectangle of the art that view cut out, in art pixels.'),
    rows: z.array(z.strictObject({ facing: FACING_SCHEMA, tagId: TAG_ID_SCHEMA })).optional().describe('allFacings: the facing of each row from the top, with its tag.'),
  }),
});

export { renderPreviewTool };
