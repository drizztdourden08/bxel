/* @layer core @kind logic */
import { editLayerCells } from '../../draft/edit-layer-cells';
import { mapWriteSchema } from '../../schema/map-write-schema';
import { cellOfBits } from '../../tilemap/cell-of-bits';
import { FLAG_BIT } from '../../tilemap/flag-bits.constants';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { ERROR_CODE } from '../error-code.constants';
import { fail } from '../fail';
import { openLayer } from '../tilemap/open-layer';
import { requireTile } from '../../read/require-tile';

const mapWrite = defineCommand({
  name: COMMAND_NAME.mapWrite,
  scope: 'none',
  schema: mapWriteSchema,
  run: (draft, input) => {
    const { rect, keys, flags } = input.options;
    const opened = openLayer(draft, input.options);
    const { columns, rows } = opened.tilemap;
    if (rect.x + rect.width > columns || rect.y + rect.height > rows) {
      throw fail(ERROR_CODE.OUT_OF_BOUNDS, `The rectangle leaves the ${columns} x ${rows} map.`, { path: 'options.rect' });
    }
    for (const key of new Set(keys)) if (key !== 0) requireTile(opened.tileset, key);
    if (flags?.some((bits, at) => (bits & FLAG_BIT.diagonal) !== 0 && keys[at] !== 0) && opened.tileset.tileWidth !== opened.tileset.tileHeight) {
      throw fail(ERROR_CODE.INVALID_OPTION, 'A turned tile needs square tiles.', { path: 'options.flags' });
    }
    editLayerCells(draft, opened, (cells) => {
      keys.forEach((key, at) => {
        const column = rect.x + (at % rect.width);
        const row = rect.y + Math.floor(at / rect.width);
        cells[row * columns + column] = cellOfBits(key, flags?.[at] ?? 0);
      });
    });
  },
});

export { mapWrite };
