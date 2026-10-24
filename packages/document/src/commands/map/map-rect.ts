/* @layer core @kind logic */
import { editLayerCells } from '../../draft/edit-layer-cells';
import { clipRect } from '../../geometry/clip-rect';
import { mapRectSchema } from '../../schema/map-rect-schema';
import { makeCell } from '../../tilemap/make-cell';
import { onRectBorder } from '../../tilemap/on-rect-border';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { checkFlags } from '../tilemap/check-flags';
import { openLayer } from '../tilemap/open-layer';
import { resolveTileKey } from '../tilemap/resolve-tile-key';

const mapRect = defineCommand({
  name: COMMAND_NAME.mapRect,
  scope: 'none',
  schema: mapRectSchema,
  run: (draft, input) => {
    const { options } = input;
    const opened = openLayer(draft, options);
    checkFlags(opened.tileset, options.flags);
    const value = makeCell(resolveTileKey(draft, opened.tileset, options.tile), options.flags);
    const area = clipRect(options.rect, { width: opened.tilemap.columns, height: opened.tilemap.rows });
    if (!area) return;
    editLayerCells(draft, opened, (cells) => {
      for (let y = area.y; y < area.y + area.height; y += 1) {
        for (let x = area.x; x < area.x + area.width; x += 1) {
          if (options.filled || onRectBorder(options.rect, x, y)) cells[y * opened.tilemap.columns + x] = value;
        }
      }
    });
  },
});

export { mapRect };
