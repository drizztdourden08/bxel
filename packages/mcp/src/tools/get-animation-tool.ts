/* @layer core @kind logic */
import { z } from 'zod';
import {
  ANIM_FRAME_ID_SCHEMA,
  ANIMATION_ID_SCHEMA,
  BANK_ID_SCHEMA,
  DOCUMENT_ID_SCHEMA,
  REVISION_SCHEMA,
  SHEET_ID_SCHEMA,
  SPRITE_ID_SCHEMA,
  TAG_ID_SCHEMA,
  TILESET_ID_SCHEMA,
} from '../schema/ids.constants';
import { COUNT_SCHEMA, HEX_COLOR_SCHEMA } from '../schema/shapes.constants';
import { withFailure } from '../schema/with-failure';
import { defineTool } from './define-tool';
import { TOOL_NAME } from './tool-name.constants';

const DIRECTION = z.enum(['forward', 'reverse', 'pingpong', 'pingpongReverse']);
const FACING = z.enum(['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw']);

const frame = z.strictObject({
  frameId: ANIM_FRAME_ID_SCHEMA,
  index: COUNT_SCHEMA,
  spriteId: SPRITE_ID_SCHEMA.nullable().describe('The sprite this frame shows. Null for an empty frame. Edit its pixels with pixels.patch on this sprite.'),
  owned: z.boolean().describe('True when the sprite belongs to this animation. A project sprite (false) is shared, and editing it changes every user.'),
  clip: z.strictObject({ x: COUNT_SCHEMA, y: COUNT_SCHEMA, width: COUNT_SCHEMA, height: COUNT_SCHEMA }).nullable(),
  durationMs: COUNT_SCHEMA,
  offset: z.strictObject({ x: z.number().int(), y: z.number().int() }),
  pivot: z.strictObject({ x2: z.number().int(), y2: z.number().int() }).nullable(),
});

const spanTag = z.strictObject({
  kind: z.literal('span'),
  tagId: TAG_ID_SCHEMA,
  name: z.string(),
  from: COUNT_SCHEMA.describe('Index of the first frame.'),
  to: COUNT_SCHEMA.describe('Index of the last frame.'),
  direction: DIRECTION,
  repeat: COUNT_SCHEMA.describe('0 plays forever.'),
  facing: FACING.optional(),
  colour: HEX_COLOR_SCHEMA.optional(),
});

const mirrorTag = z.strictObject({
  kind: z.literal('mirror'),
  tagId: TAG_ID_SCHEMA,
  of: TAG_ID_SCHEMA,
  flip: z.enum(['x', 'y']),
  facing: FACING,
});

const getAnimationTool = defineTool(TOOL_NAME.getAnimation, {
  title: 'Get an animation',
  description:
    'One animation of a document: its canvas, anchor, loop, frames (with the sprite each shows, and whether the animation owns it), tags and what uses it. List animations with list_assets (kind animation) or get_document. Edit with apply_edits: animation.frame.add, animation.frame.update, animation.tag.add and the other animation.* steps. Look at it with render_preview.',
  input: z.strictObject({
    documentId: DOCUMENT_ID_SCHEMA,
    animationId: ANIMATION_ID_SCHEMA,
  }),
  output: withFailure({
    revision: REVISION_SCHEMA,
    animationId: ANIMATION_ID_SCHEMA,
    name: z.string(),
    width: COUNT_SCHEMA,
    height: COUNT_SCHEMA,
    bankId: BANK_ID_SCHEMA,
    anchor: z.strictObject({ x2: z.number().int(), y2: z.number().int() }),
    loop: z.strictObject({ direction: DIRECTION, repeat: COUNT_SCHEMA }),
    directions: z.enum(['none', 'four', 'eight']),
    cycleMs: COUNT_SCHEMA.describe('Duration of one pass of the whole animation.'),
    frames: z.array(frame),
    tags: z.array(z.discriminatedUnion('kind', [spanTag, mirrorTag])),
    usedBy: z.strictObject({
      sheets: z.array(SHEET_ID_SCHEMA),
      tilesets: z.array(z.strictObject({ tilesetId: TILESET_ID_SCHEMA, keys: z.array(COUNT_SCHEMA) })),
    }),
  }),
});

export { getAnimationTool };
