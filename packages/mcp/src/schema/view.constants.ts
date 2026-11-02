/* @layer core @kind constants */
import { z } from 'zod';
import { ANIM_FRAME_ID_SCHEMA, DOCUMENT_ID_SCHEMA, LAYER_ID_SCHEMA, MAP_LAYER_ID_SCHEMA, SPRITE_ID_SCHEMA, TAG_ID_SCHEMA } from './ids.constants';
import { CELL_MASK_SCHEMA } from './cell-mask.constants';
import { CELL_RECT_SCHEMA } from './cell-rect.constants';
import { BROWSE_INPUT_SCHEMA, PROJECT_PANEL_INPUT_SCHEMA, PROPERTIES_INPUT_SCHEMA, TILESET_INPUT_SCHEMA } from './project-view.constants';
import { LOCATION_SCHEMA } from './place.constants';
import { TIMELINE_INPUT_SCHEMA } from './timeline-view.constants';
import { OPTION_VALUES_SCHEMA } from './tool-options.constants';

const COORDINATE_SCHEMA = z.number().int().min(-100000).max(100000);

const VIEW_RECT_SCHEMA = z.strictObject({
  x: COORDINATE_SCHEMA,
  y: COORDINATE_SCHEMA,
  width: z.number().int().min(1).max(100000),
  height: z.number().int().min(1).max(100000),
});

const RUN_SCHEMA = z.array(COORDINATE_SCHEMA).length(3).describe('One run of selected pixels: [y, x0, x1], x1 inclusive.');

const RUNS_SCHEMA = z.array(RUN_SCHEMA).max(20000).meta({ id: 'Runs', description: 'A mask as row runs [[y, x0, x1], ...], never raw bits.' });

const TOOL_ID_VALUES = [
  'pencil', 'eraser', 'spray', 'fill', 'gradient', 'picker', 'line', 'curve', 'rect', 'ellipse', 'contour', 'polygon', 'zoom', 'hand', 'select', 'move', 'shade', 'slice',
] as const;


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

const MAP_RUNS_SCHEMA = z.array(z.array(z.number().int().min(0)).length(3)).max(20000).describe('Selected cells as row runs [row, first column, last column], last included.');

const MAP_SELECTION_REPLY_SCHEMA = z.strictObject({
  empty: z.boolean(),
  bounds: CELL_RECT_SCHEMA.nullable(),
  cells: z.number().int().min(0),
  runs: MAP_RUNS_SCHEMA.nullable().describe('Null when the selection has more runs than one reply may carry.'),
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
  properties: PROPERTIES_INPUT_SCHEMA.optional().describe('Pins or unpins the subject of the Properties panel.'),
  browse: BROWSE_INPUT_SCHEMA.optional().describe('The Browse page of the project: folder, view, selection and search.'),
  reveal: LOCATION_SCHEMA.optional().describe('Opens the Browse page on the folder of this file and selects it.'),
  projectPanel: PROJECT_PANEL_INPUT_SCHEMA.optional().describe('The Project panel widget: mode, selection, search and chips. The panel must be on screen.'),
  tileset: TILESET_INPUT_SCHEMA.optional().describe('The tileset and tilemap tool state: panel mode, search, stamp, scatter, brush flags, terrain brush and set, the collision overlay, tile animation, thumbnail zoom and the key and use badges.'),
  page: z.strictObject({ route: z.string().min(1).max(200), section: z.string().min(1).max(200).optional() }).optional(),
  zoom: z
    .union([z.number().min(1).max(6400).describe('Percent.'), z.enum(['fit', 'actual']), z.strictObject({ rect: VIEW_RECT_SCHEMA })])
    .optional(),
  pan: z.strictObject({ centreX: z.number(), centreY: z.number() }).optional(),
  marker: z
    .strictObject({
      rect: VIEW_RECT_SCHEMA,
      label: z.string().max(80).optional(),
      seconds: z.number().min(1).max(60).default(8).describe('How long the owner sees the marker.'),
    })
    .nullable()
    .optional()
    .describe('Draws a rectangle with a label on the sprite so the owner sees which pixels you mean. null clears it. A show effect, it never edits the document.'),
  toggles: z
    .strictObject({
      grid: z.boolean().optional(),
      gridMajor: z.boolean().optional(),
      gridTile: z.boolean().optional(),
      gridIso: z.boolean().optional().describe('Draw a 2 to 1 isometric diamond grid, as wide as one tile of the tile grid.'),
      guides: z.boolean().optional(),
      rulers: z.boolean().optional(),
      slices: z.boolean().optional(),
      snap: z.boolean().optional(),
      hideOverlays: z.boolean().optional().describe('Hide the grids, guides, axes, selection ants and onion skin at once.'),
      mirror: z.boolean().optional().describe('Flip the display left to right. The pixels never change.'),
      loupe: z.boolean().optional().describe('Show the round magnifier beside the pointer.'),
      split: z.boolean().optional().describe('Show a second view of the same art.'),
      splitLink: z.boolean().optional().describe('Pan and zoom both split views together.'),
      splitActual: z.boolean().optional().describe('Keep the second split view at actual size.'),
      fullscreen: z.boolean().optional().describe('Show the art at a whole number scale on the background.'),
      lockGuides: z.boolean().optional(),
      tiled: z.enum(TILED_VALUES).optional(),
      onionSkin: z.boolean().optional(),
      highlightLayer: z.boolean().optional().describe('Dim every layer but the current one, on a sprite and on a map. get_view highlight says which layer stays lit.'),
      animatedTiles: z.boolean().optional().describe('Play the tile animations on the map. The collision overlay is set in tileset.collisionOverlay.'),
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
  timeline: TIMELINE_INPUT_SCHEMA.optional(),
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
      id: z.enum(TOOL_ID_VALUES).optional().describe('Pick a tool by id. member and preset are the other ways; give at most one of the three.'),
      member: z.string().min(1).max(100).optional().describe('Pick a tool member from list_tools, such as select-wand. It also sets the select variant the member stands for.'),
      preset: z.string().min(1).max(200).optional().describe('Apply a preset from list_presets: picks its member and sets its fields.'),
      options: OPTION_VALUES_SCHEMA.optional().describe('Option values by option id, set after the tool is picked. Refused during an owner stroke or a borrowed tool.'),
    })
    .refine((tool) => [tool.id, tool.member, tool.preset].filter((each) => each !== undefined).length <= 1, { message: 'Give at most one of id, member and preset.' })
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
  mapSelection: z
    .strictObject({
      op: z.enum(COMBINE_VALUES).default('replace'),
      cells: z.union([z.literal('none'), CELL_MASK_SCHEMA]).describe('"none" drops the selection. Otherwise the cells to select, described, on the open tilemap and its active layer.'),
    })
    .optional()
    .describe('Selects cells on the tilemap the owner has open, with the same combine rules as selection. The owner sees the cells and can move, copy or cut them.'),
});

export { COMBINE_VALUES, MAP_SELECTION_REPLY_SCHEMA, RUNS_SCHEMA, SELECTION_REPLY_SCHEMA, SET_VIEW_INPUT_SCHEMA, TOOL_ID_VALUES };
