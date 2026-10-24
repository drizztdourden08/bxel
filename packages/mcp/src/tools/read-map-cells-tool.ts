/* @layer core @kind logic */
import { z } from 'zod';
import { CELL_RECT_SCHEMA } from '../schema/cell-rect.constants';
import { DOCUMENT_ID_SCHEMA, MAP_LAYER_ID_SCHEMA, REVISION_SCHEMA, TILEMAP_ID_SCHEMA } from '../schema/ids.constants';
import { COUNT_SCHEMA } from '../schema/shapes.constants';
import { withFailure } from '../schema/with-failure';
import { defineTool } from './define-tool';
import { TOOL_NAME } from './tool-name.constants';

const readMapCellsTool = defineTool(TOOL_NAME.readMapCells, {
  title: 'Read map cells',
  description:
    'A rectangle of cells from one layer of a tilemap, row by row. keys holds the tile key of each cell (0 is empty) and flags the turn bits: 1 flip x, 2 flip y, 4 turn. At most 16384 cells. map.write takes the same shape, so a read can be changed and written back in one step.',
  input: z.strictObject({
    documentId: DOCUMENT_ID_SCHEMA,
    tilemapId: TILEMAP_ID_SCHEMA,
    layerId: MAP_LAYER_ID_SCHEMA,
    rect: CELL_RECT_SCHEMA,
  }),
  output: withFailure({
    revision: REVISION_SCHEMA,
    rect: CELL_RECT_SCHEMA,
    keys: z.array(COUNT_SCHEMA),
    flags: z.array(z.number().int().min(0).max(7)),
  }),
});

export { readMapCellsTool };
