/* @layer core @kind constants */
import { z } from 'zod';
import { ANIM_FRAME_ID_SCHEMA, ANIMATION_ID_SCHEMA, TAG_ID_SCHEMA } from './ids.constants';
import { HEX_COLOR_SCHEMA } from './shapes.constants';

const PLAY_MODE_VALUES = ['loop', 'once', 'pingpong'] as const;

const TIME_UNIT_VALUES = ['ms', 'seconds', 'ticks'] as const;

const ONION_FIELDS = {
  on: z.boolean(),
  before: z.number().int().min(0).max(8).describe('Ghost frames before the shown one, 0 to 8.'),
  after: z.number().int().min(0).max(8).describe('Ghost frames after the shown one, 0 to 8.'),
  opacity: z.number().int().min(5).max(80).describe('Percent, 5 to 80.'),
  falloff: z.enum(['linear', 'flat']),
  tint: z.enum(['none', 'split', 'grey']),
  beforeColour: HEX_COLOR_SCHEMA,
  afterColour: HEX_COLOR_SCHEMA,
  style: z.enum(['filled', 'outline']),
  order: z.enum(['play', 'strip']).describe('Ghost the neighbours in play order or in strip order.'),
  wrap: z.boolean().describe('The last frame of a looping range ghosts before the first.'),
  scope: z.enum(['range', 'all']),
  skipRepeats: z.boolean().describe('Do not ghost a frame that shows the same sprite as the shown one.'),
  position: z.enum(['behind', 'front']),
  hideWhilePlaying: z.boolean(),
} as const;

const TIMELINE_RANGE_SCHEMA = z.discriminatedUnion('kind', [
  z.strictObject({ kind: z.literal('whole') }),
  z.strictObject({ kind: z.literal('picked') }),
  z.strictObject({ kind: z.literal('tag'), tagId: TAG_ID_SCHEMA }),
  z.strictObject({ kind: z.literal('loop'), from: ANIM_FRAME_ID_SCHEMA, to: ANIM_FRAME_ID_SCHEMA }),
]);

const ONION_INPUT_SCHEMA = z.strictObject({
  on: ONION_FIELDS.on.optional(),
  before: ONION_FIELDS.before.optional(),
  after: ONION_FIELDS.after.optional(),
  opacity: ONION_FIELDS.opacity.optional(),
  falloff: ONION_FIELDS.falloff.optional(),
  tint: ONION_FIELDS.tint.optional(),
  beforeColour: ONION_FIELDS.beforeColour.optional(),
  afterColour: ONION_FIELDS.afterColour.optional(),
  style: ONION_FIELDS.style.optional(),
  order: ONION_FIELDS.order.optional(),
  wrap: ONION_FIELDS.wrap.optional(),
  scope: ONION_FIELDS.scope.optional(),
  skipRepeats: ONION_FIELDS.skipRepeats.optional(),
  position: ONION_FIELDS.position.optional(),
  hideWhilePlaying: ONION_FIELDS.hideWhilePlaying.optional(),
});

const TIMELINE_INPUT_SCHEMA = z.strictObject({
  frameId: ANIM_FRAME_ID_SCHEMA.optional().describe('Move the playhead to this frame of the open animation. The pick stays as it is.'),
  pickedFrameIds: z.array(ANIM_FRAME_ID_SCHEMA).max(512).optional().describe('The frames picked in the strip, in any order. An empty list clears the pick.'),
  range: TIMELINE_RANGE_SCHEMA.optional().describe('What play loops over: the whole animation, the picked frames, a tag or a loop range.'),
  playing: z.boolean().optional(),
  playMode: z.enum(PLAY_MODE_VALUES).optional(),
  speed: z.number().min(0.25).max(2).optional().describe('Play speed multiplier, 0.25 to 2.'),
  zoom: z.union([z.number().int().min(16).max(96), z.literal('fit')]).optional().describe('Frame thumbnail size in pixels, or "fit".'),
  timeMode: z.boolean().optional().describe('Draw the strip with widths that follow the frame durations.'),
  units: z.enum(TIME_UNIT_VALUES).optional(),
  onion: ONION_INPUT_SCHEMA.optional(),
});

const TIMELINE_STATE_SCHEMA = z.strictObject({
  animationId: ANIMATION_ID_SCHEMA.nullable().describe('The animation open in the timeline, or null when no animation tab is active.'),
  frameId: ANIM_FRAME_ID_SCHEMA.nullable().describe('The playhead.'),
  pickedFrameIds: z.array(ANIM_FRAME_ID_SCHEMA),
  range: TIMELINE_RANGE_SCHEMA,
  playing: z.boolean(),
  playMode: z.enum(PLAY_MODE_VALUES),
  speed: z.number(),
  zoom: z.union([z.number().int(), z.literal('fit')]),
  timeMode: z.boolean(),
  units: z.enum(TIME_UNIT_VALUES),
  onion: z.strictObject(ONION_FIELDS),
});

export { TIMELINE_INPUT_SCHEMA, TIMELINE_STATE_SCHEMA };
