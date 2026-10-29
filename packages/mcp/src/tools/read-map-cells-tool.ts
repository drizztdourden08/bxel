/* @layer core @kind logic */
import { z } from 'zod';
import { CELL_MASK_SCHEMA } from '../schema/cell-mask.constants';
import { CELL_RECT_SCHEMA } from '../schema/cell-rect.constants';
import { DOCUMENT_ID_SCHEMA, MAP_LAYER_ID_SCHEMA, REVISION_SCHEMA, TILEMAP_ID_SCHEMA } from '../schema/ids.constants';
import { COUNT_SCHEMA } from '../schema/shapes.constants';
import { withFailure } from '../schema/with-failure';
import { defineTool } from './define-tool';
import { SELECTED_SCHEMA } from './read-map-cells-tool.constants';
import { TOOL_NAME } from './tool-name.constants';

const readMapCellsTool = defineTool(TOOL_NAME.readMapCells, {
  title: 'Read map cells',
  description:
    'Cells from one layer of a tilemap. Give a rect to get its cells row by row: keys holds the tile key of each cell (0 is empty) and flags the turn bits: 1 flip x, 2 flip y, 4 turn. At most 16384 cells. map.write takes the same shape, so a read can be changed and written back in one step. Give a mask instead of a rect, or with it, to find cells by description: a connected area of one tile (wand), every cell of a tile (same or tile), a list, row runs or a combination. The reply then holds selected, with the cells that match, and map.copy and map.move take the same mask.',
  input: z
    .strictObject({
      documentId: DOCUMENT_ID_SCHEMA,
      tilemapId: TILEMAP_ID_SCHEMA,
      layerId: MAP_LAYER_ID_SCHEMA,
      rect: CELL_RECT_SCHEMA.optional(),
      mask: CELL_MASK_SCHEMA.optional(),
    })
    .refine((value) => value.rect !== undefined || value.mask !== undefined, { message: 'Give a rect, a mask or both.', path: ['rect'] }),
  output: withFailure({
    revision: REVISION_SCHEMA,
    rect: CELL_RECT_SCHEMA.optional(),
    keys: z.array(COUNT_SCHEMA).optional(),
    flags: z.array(z.number().int().min(0).max(7)).optional(),
    selected: SELECTED_SCHEMA.optional(),
  }),
});

export { readMapCellsTool };
