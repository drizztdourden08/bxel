/* @layer core @kind logic */
import { mapLineSchema } from '../../schema/map-line-schema';
import { makeCell } from '../../tilemap/make-cell';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { checkFlags } from '../tilemap/check-flags';
import { placeCells } from '../tilemap/place-cells';
import { resolveTileKey } from '../tilemap/resolve-tile-key';

const mapLine = defineCommand({
  name: COMMAND_NAME.mapLine,
  scope: 'none',
  schema: mapLineSchema,
  run: (draft, input) => {
    const { tile, flags, from, to, tilemap, layer } = input.options;
    placeCells(draft, { tilemap, layer, points: [from, to] }, ({ tileset }) => {
      checkFlags(tileset, flags);
      return makeCell(resolveTileKey(draft, tileset, tile), flags);
    });
  },
});

export { mapLine };
