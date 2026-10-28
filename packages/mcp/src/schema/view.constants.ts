/* @layer core @kind constants */
import { z } from 'zod';
import { ANIM_FRAME_ID_SCHEMA, DOCUMENT_ID_SCHEMA, LAYER_ID_SCHEMA, MAP_LAYER_ID_SCHEMA, SPRITE_ID_SCHEMA, TAG_ID_SCHEMA } from './ids.constants';

const COORDINATE_SCHEMA = z.number().int().min(-100000).max(100000);

const VIEW_RECT_SCHEMA = z.strictObject({
  x: COORDINATE_SCHEMA,
  y: COORDINATE_SCHEMA,
  width: z.number().int().min(1).max(100000),
  height: z.number().int().min(1).max(100000),
});

const RUN_SCHEMA = z.array(COORDINATE_SCHEMA).length(3).describe('One run of selected pixels: [y, x0, x1], x1 inclusive.');

const RUNS_SCHEMA = z.array(RUN_SCHEMA).max(20000).meta({ id: 'Runs', description: 'A mask as row runs [[y, x0, x1], ...], never raw bits.' });

const TOOL_ID_VALUES = ['pencil', 'eraser', 'fill', 'picker', 'shape', 'zoom', 'hand', 'select', 'move'] as const;

const TILED_VALUES = ['off', 'x', 'y', 'both'] as const;

const COMBINE_VALUES = ['replace', 'add', 'subtract', 'intersect'] as const;

const SELECTION_SHAPE_SCHEMA = z.discriminatedUnion('kind', [
  z.strictObject({ kind: z.literal('all') }),
  z.strictObject({ kind: z.literal('none') }),
  z.strictObject({ kind: z.literal('invert') }),
  z.strictObject({ kind: z.literal('rect'), rect: VIEW_RECT_SCHEMA }),
  z.strictObject({ kind: z.literal('rects'), rects: z.array(VIEW_RECT_SCHEMA).min(1).max(256) }),
  z.strictObject({ kind: z.literal('polygon'), points: z.array(z.strictObject({ x: COORDINATE_SCHEMA, y: COORDINATE_SCHEMA })).min(3).max(1024) }),
  z.strictObject({ kind: z.literal('wand'), x: COORDINATE_SCHEMA, y: COORDINATE_SCHEMA, connectivity: z.union([z.literal(4), z.literal(8)]).default(4) }),
  z.strictObject({ kind: z.literal('colour'), index: z.number().int().min(0).max(255) }),
  z.strictObject({ kind: z.literal('runs'), runs: RUNS_SCHEMA }),
]);

const SELECTION_REPLY_SCHEMA = z.strictObject({
  empty: z.boolean(),
  bounds: VIEW_RECT_SCHEMA.nullable(),
  pixels: z.number().int().min(0),
  runs: RUNS_SCHEMA.nullable().describe('Null when the mask has more runs than one reply may carry.'),
});

const SET_VIEW_INPUT_SCHEMA = z.strictObject({
  dialog: z.strictObject({ answer: z.string().min(1).max(100).describe('A choice id from get_view dialog.choices.') }).optional(),
  focus: z
    .strictObject({
      tabId: z.string().min(1).max(200).optional(),
      documentId: DOCUMENT_ID_SCHEMA.optional(),
      raise: z.boolean().default(false).describe('Also bring the window to the front.'),
    })
    .optional(),
  page: z.strictObject({ route: z.string().min(1).max(200), section: z.string().min(1).max(200).optional() }).optional(),
  zoom: z
    .union([z.number().min(1).max(6400).describe('Percent.'), z.enum(['fit', 'actual']), z.strictObject({ rect: VIEW_RECT_SCHEMA })])
    .optional(),
  pan: z.strictObject({ centreX: z.number(), centreY: z.number() }).optional(),
  toggles: z
    .strictObject({
      grid: z.boolean().optional(),
      gridMajor: z.boolean().optional(),
      gridTile: z.boolean().optional(),
      guides: z.boolean().optional(),
      rulers: z.boolean().optional(),
      tiled: z.enum(TILED_VALUES).optional(),
      onionSkin: z.boolean().optional(),
    })
    .optional(),
  playback: z
    .strictObject({
      playing: z.boolean().optional(),
      frame: ANIM_FRAME_ID_SCHEMA.optional(),
      tag: TAG_ID_SCHEMA.nullable().optional(),
      loop: z.boolean().optional(),
    })
    .optional(),
  select: z
    .strictObject({
      sprite: SPRITE_ID_SCHEMA.optional(),
      frame: ANIM_FRAME_ID_SCHEMA.optional().describe('An animation frame id: the frame shown in the timeline.'),
      frames: z.array(ANIM_FRAME_ID_SCHEMA).max(512).optional(),
      layer: LAYER_ID_SCHEMA.optional(),
      mapLayer: MAP_LAYER_ID_SCHEMA.optional(),
      tile: z.number().int().min(0).optional(),
      sprites: z.array(SPRITE_ID_SCHEMA).max(512).optional(),
    })
    .optional(),
  tool: z
    .strictObject({
      id: z.enum(TOOL_ID_VALUES).optional(),
      options: z
        .strictObject({
          brushSize: z.number().int().min(1).max(64).optional(),
          brushShape: z.enum(['square', 'circle']).optional(),
          pixelPerfect: z.boolean().optional(),
          fillMode: z.enum(['contiguous', 'global']).optional(),
          connectivity: z.union([z.literal(4), z.literal(8)]).optional(),
          shape: z.enum(['line', 'rect', 'ellipse']).optional(),
          filled: z.boolean().optional(),
        })
        .optional(),
    })
    .optional(),
  colours: z
    .strictObject({
      foreground: z.number().int().min(0).max(255).optional(),
      background: z.number().int().min(0).max(255).optional(),
      third: z.number().int().min(0).max(255).optional(),
      fourth: z.number().int().min(0).max(255).optional(),
    })
    .optional(),
  symmetry: z
    .strictObject({
      x: z.boolean().optional(),
      y: z.boolean().optional(),
      axisX: z.number().nullable().optional().describe('Doubled pixel coordinate of the mirror axis, null to remove it.'),
      axisY: z.number().nullable().optional(),
    })
    .optional(),
  selection: z
    .strictObject({
      op: z.enum(COMBINE_VALUES).default('replace'),
      shape: SELECTION_SHAPE_SCHEMA,
    })
    .optional(),
});

export {
  COMBINE_VALUES,
  COORDINATE_SCHEMA,
  RUNS_SCHEMA,
  SELECTION_REPLY_SCHEMA,
  SELECTION_SHAPE_SCHEMA,
  SET_VIEW_INPUT_SCHEMA,
  TILED_VALUES,
  TOOL_ID_VALUES,
  VIEW_RECT_SCHEMA,
};
