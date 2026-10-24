/* @layer core @kind logic */
import { editLayerCells } from '../../draft/edit-layer-cells';
import { mapFillSchema } from '../../schema/map-fill-schema';
import { floodCells } from '../../tilemap/flood-cells';
import { makeCell } from '../../tilemap/make-cell';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { cellIndex } from '../tilemap/cell-index';
import { checkFlags } from '../tilemap/check-flags';
import { openLayer } from '../tilemap/open-layer';
import { resolveTileKey } from '../tilemap/resolve-tile-key';

const mapFill = defineCommand({
  name: COMMAND_NAME.mapFill,
  scope: 'none',
  schema: mapFillSchema,
  run: (draft, input) => {
    const { options } = input;
    const opened = openLayer(draft, options);
    const seed = cellIndex(opened.tilemap, options.at, 'options.at');
    checkFlags(opened.tileset, options.flags);
    const value = makeCell(resolveTileKey(draft, opened.tileset, options.tile), options.flags);
    editLayerCells(draft, opened, (cells) => {
      floodCells(cells, opened.tilemap, seed, value);
    });
  },
});

export { mapFill };
