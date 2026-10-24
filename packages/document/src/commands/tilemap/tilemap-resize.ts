/* @layer core @kind logic */
import { updateTilemap } from '../../draft/update-tilemap';
import { tilemapResizeSchema } from '../../schema/tilemap-resize-schema';
import { resizeCells } from '../../tilemap/resize-cells';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { checkMapSize } from './check-map-size';
import { pickTilemap } from './pick-tilemap';

const tilemapResize = defineCommand({
  name: COMMAND_NAME.tilemapResize,
  scope: 'none',
  schema: tilemapResizeSchema,
  run: (draft, input) => {
    const { columns, rows, offset = { x: 0, y: 0 } } = input.options;
    const tilemap = pickTilemap(draft, input.options.tilemap);
    checkMapSize({ width: columns, height: rows });
    if (columns === tilemap.columns && rows === tilemap.rows && offset.x === 0 && offset.y === 0) return;
    updateTilemap(draft, tilemap.id, (current) => ({
      ...current,
      columns,
      rows,
      layers: current.layers.map((layer) => ({ ...layer, cells: resizeCells(layer.cells, current, { columns, rows }, offset) })),
    }));
  },
});

export { tilemapResize };
