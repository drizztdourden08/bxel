/* @layer core @kind constants */
import { z } from 'zod';
import { FOLDER_ID_SCHEMA, PROJECT_ID_SCHEMA } from './ids.constants';
import { LOCATION_SCHEMA } from './place.constants';
import { REL_PATH_SCHEMA } from './shapes.constants';

const FOLDER_PLACE_SCHEMA = z.strictObject({ projectId: PROJECT_ID_SCHEMA, folderId: FOLDER_ID_SCHEMA, path: REL_PATH_SCHEMA.optional().describe('Absent means the root of the folder.') });

const SEARCH_SCHEMA = z.string().max(500).describe('The search text. Chips such as kind:sprite or is:unused are part of it.');

const PROPERTIES_INPUT_SCHEMA = z
  .strictObject({
    file: LOCATION_SCHEMA.nullable().optional().describe('Pin the Properties panel to this open file. Null unpins it, so it follows the active tab again.'),
    back: z.boolean().optional().describe('Step to the previous pinned subject.'),
    forward: z.boolean().optional().describe('Step to the next pinned subject.'),
  })
  .refine((input) => [input.file !== undefined, input.back === true, input.forward === true].filter(Boolean).length <= 1, { message: 'Give one of file, back and forward.' });

const BROWSE_INPUT_SCHEMA = z.strictObject({
  folder: FOLDER_PLACE_SCHEMA.nullable().optional().describe('The folder the Browse page shows. Null shows the whole project.'),
  view: z.enum(['grid', 'list', 'columns']).optional(),
  selection: z.array(LOCATION_SCHEMA).max(500).optional().describe('The files and folders selected. An empty list clears it.'),
  search: SEARCH_SCHEMA.optional(),
});

const PROJECT_PANEL_INPUT_SCHEMA = z.strictObject({
  mode: z.enum(['tree', 'list']).optional().describe('The mode of the Project panel widget.'),
  selection: z.array(LOCATION_SCHEMA).max(500).optional().describe('The rows selected in the Project panel. An empty list clears it.'),
  search: z.string().max(500).optional().describe('The typed search text of the panel, without chips.'),
  chips: z.array(z.string().min(1).max(100)).max(20).optional().describe('The chip tokens to hold, such as kind:sprite. The list replaces the chips now held.'),
});

const TILESET_MODE_VALUES = ['tiles', 'terrain', 'collision', 'data', 'animation'] as const;

const TILESET_INPUT_SCHEMA = z.strictObject({
  mode: z.enum(TILESET_MODE_VALUES).optional().describe('The mode of the tileset panel.'),
  search: z.string().max(200).optional(),
  stamp: z
    .strictObject({
      columns: z.number().int().min(1).max(64),
      rows: z.number().int().min(1).max(64),
      keys: z.array(z.number().int().min(0)).min(1).max(4096).describe('The tile keys of the stamp, row by row. The count is columns times rows.'),
    })
    .optional(),
  scatter: z.boolean().optional().describe('Place the stamp tiles at random instead of as a block.'),
  terrainBrush: z.boolean().optional(),
  collisionOverlay: z.boolean().optional().describe('Show the collision shapes over the map.'),
  flags: z
    .strictObject({ flipX: z.boolean().optional(), flipY: z.boolean().optional(), diagonal: z.boolean().optional() })
    .optional()
    .describe('The flip and diagonal flags the brush places tiles with. A flag left out keeps its value.'),
  animate: z.boolean().optional().describe('Animate the animated tiles in the tile grid and on the map.'),
  zoom: z.union([z.literal('fit'), z.literal(1), z.literal(2), z.literal(3), z.literal(4)]).optional().describe('The size of the tile thumbnails in the tile grid: fit, or 1 to 4 times.'),
  showKeys: z.boolean().optional().describe('Show the tile key on each tile of the grid.'),
  showUses: z.boolean().optional().describe('Show how many map cells use each tile.'),
  terrainSet: z.string().min(1).max(100).nullable().optional().describe('The id of the terrain set the terrain brush and the terrain panel use. Null picks the first set.'),
});

export { BROWSE_INPUT_SCHEMA, PROJECT_PANEL_INPUT_SCHEMA, PROPERTIES_INPUT_SCHEMA, TILESET_INPUT_SCHEMA };
