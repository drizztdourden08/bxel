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
import { DIRECTION_SCHEMA, FACING_SCHEMA } from './get-animation-tool.constants';
import { TOOL_NAME } from './tool-name.constants';

const frame = z.strictObject({
  frameId: ANIM_FRAME_ID_SCHEMA,
  index: COUNT_SCHEMA,
  spriteId: SPRITE_ID_SCHEMA.nullable().describe('The sprite this frame shows. Null for an empty frame. Edit its pixels with pixels.patch on this sprite.'),
  owned: z.boolean().describe('True when the sprite belongs to this animation. A project sprite (false) is shared, and editing it changes every user.'),
  clip: z.strictObject({ x: COUNT_SCHEMA, y: COUNT_SCHEMA, width: COUNT_SCHEMA, height: COUNT_SCHEMA }).nullable(),
  durationMs: COUNT_SCHEMA,
  offset: z.strictObject({ x: z.number().int(), y: z.number().int() }),
  pivot: z.strictObject({ x2: z.number().int(), y2: z.number().int() }).nullable(),
  sameSpriteAs: COUNT_SCHEMA.nullable().describe('Index of an earlier frame that shows the same sprite (a repeat), else null.'),
});

const FLIP = z.enum(['x', 'y']);

const playStep = z.strictObject({
  index: COUNT_SCHEMA.describe('Index of the frame.'),
  frameId: ANIM_FRAME_ID_SCHEMA,
  flip: FLIP.nullable().describe('Mirrored on this axis by a mirror tag, else null.'),
  ms: COUNT_SCHEMA,
});

const play = z.strictObject({
  tagId: TAG_ID_SCHEMA.nullable().describe('Null for the whole animation.'),
  name: z.string(),
  facing: FACING_SCHEMA.nullable(),
  mirrorOf: TAG_ID_SCHEMA.nullable().describe('The tag a mirror tag copies, else null.'),
  flip: FLIP.nullable(),
  direction: DIRECTION_SCHEMA,
  repeat: COUNT_SCHEMA.describe('0 plays forever.'),
  forever: z.boolean(),
  steps: z.array(playStep).describe('The frames in play order with the repeats expanded. A forever play lists one pass.'),
  truncated: z.boolean().describe('True when the repeats made the list longer than a reply carries.'),
  passMs: COUNT_SCHEMA.describe('Duration of one pass.'),
  totalMs: COUNT_SCHEMA.describe('Duration of all the repeats. One pass when it plays forever.'),
  fps: z.number().describe('Frames per second over the whole play, rounded to two places. 0 when empty.'),
});

const spanTag = z.strictObject({
  kind: z.literal('span'),
  tagId: TAG_ID_SCHEMA,
  name: z.string(),
  from: COUNT_SCHEMA.describe('Index of the first frame.'),
  to: COUNT_SCHEMA.describe('Index of the last frame.'),
  direction: DIRECTION_SCHEMA,
  repeat: COUNT_SCHEMA.describe('0 plays forever.'),
  facing: FACING_SCHEMA.optional(),
  colour: HEX_COLOR_SCHEMA.optional(),
});

const mirrorTag = z.strictObject({
  kind: z.literal('mirror'),
  tagId: TAG_ID_SCHEMA,
  of: TAG_ID_SCHEMA,
  flip: z.enum(['x', 'y']),
  facing: FACING_SCHEMA,
});

const getAnimationTool = defineTool(TOOL_NAME.getAnimation, {
  title: 'Get an animation',
  description:
    'One animation of a document: its canvas, anchor, loop, frames (with the sprite each shows, whether the animation owns it, and sameSpriteAs for repeats), tags, the play order of the whole animation and of each tag (frame, flip, ms, repeats expanded, with totals and fps), the facing to tag map, and what uses it. List animations with list_assets (kind animation) or get_document. Edit with apply_edits: animation.frame.add, animation.frame.update, animation.tag.add and the other animation.* steps. Look at it with render_preview.',
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
    loop: z.strictObject({ direction: DIRECTION_SCHEMA, repeat: COUNT_SCHEMA }),
    directions: z.enum(['none', 'four', 'eight']),
    cycleMs: COUNT_SCHEMA.describe('Duration of one pass of the whole animation.'),
    frames: z.array(frame),
    tags: z.array(z.discriminatedUnion('kind', [spanTag, mirrorTag])),
    plays: z.array(play).describe('The play order of the whole animation first, then of each tag, so no index shifting is needed to judge the timing.'),
    facings: z.record(z.string(), TAG_ID_SCHEMA).describe('Facing letter (n, ne, e, se, s, sw, w, nw) to the tag that plays it.'),
    usedBy: z.strictObject({
      sheets: z.array(SHEET_ID_SCHEMA),
      tilesets: z.array(z.strictObject({ tilesetId: TILESET_ID_SCHEMA, keys: z.array(COUNT_SCHEMA) })),
    }),
  }),
});

export { getAnimationTool };
