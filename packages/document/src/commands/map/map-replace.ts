/* @layer core @kind logic */
import { editLayerCells } from '../../draft/edit-layer-cells';
import { clipRect } from '../../geometry/clip-rect';
import { requireTile } from '../../read/require-tile';
import { mapReplaceSchema } from '../../schema/map-replace-schema';
import { areaTest } from '../../tilemap/area-test';
import { replaceKeyInCells } from '../../tilemap/replace-key-in-cells';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { openLayer } from '../tilemap/open-layer';

const mapReplace = defineCommand({
  name: COMMAND_NAME.mapReplace,
  scope: 'none',
  schema: mapReplaceSchema,
  run: (draft, input) => {
    const { options } = input;
    const opened = openLayer(draft, options);
    const { columns, rows } = opened.tilemap;
    if (options.to !== 0) requireTile(opened.tileset, options.to);
    const area = options.rect ? clipRect(options.rect, { width: columns, height: rows }) : null;
    if (options.from === options.to || (options.rect && !area)) return;
    const inside = area ? areaTest(area, columns) : undefined;
    editLayerCells(draft, opened, (cells) => {
      replaceKeyInCells(cells, { from: options.from, to: options.to }, inside);
    });
  },
});

export { mapReplace };
