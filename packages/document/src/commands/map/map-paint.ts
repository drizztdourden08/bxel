/* @layer core @kind logic */
import { mapPaintSchema } from '../../schema/map-paint-schema';
import { makeCell } from '../../tilemap/make-cell';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { checkFlags } from '../tilemap/check-flags';
import { placeCells } from '../tilemap/place-cells';
import { resolveTileKey } from '../tilemap/resolve-tile-key';

const mapPaint = defineCommand({
  name: COMMAND_NAME.mapPaint,
  scope: 'none',
  schema: mapPaintSchema,
  run: (draft, input) => {
    const { tile, flags } = input.options;
    placeCells(draft, input.options, ({ tileset }) => {
      checkFlags(tileset, flags);
      return makeCell(resolveTileKey(draft, tileset, tile), flags);
    });
  },
});

export { mapPaint };
