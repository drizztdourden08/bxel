/* @layer core @kind logic */
import { editLayerCells } from '../../draft/edit-layer-cells';
import { mapPaintSchema } from '../../schema/map-paint-schema';
import { makeCell } from '../../tilemap/make-cell';
import { seededRandom } from '../../tilemap/seeded-random';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { checkFlags } from '../tilemap/check-flags';
import { openLayer } from '../tilemap/open-layer';
import { placeCells } from '../tilemap/place-cells';
import { placementIndexes } from '../tilemap/placement-indexes';
import { resolveTileKey } from '../tilemap/resolve-tile-key';

const mapPaint = defineCommand({
  name: COMMAND_NAME.mapPaint,
  scope: 'none',
  schema: mapPaintSchema,
  run: (draft, input) => {
    const { tile, flags, random } = input.options;
    if (random) {
      const opened = openLayer(draft, input.options);
      checkFlags(opened.tileset, flags);
      const cellsOf = random.tiles.map((each) => makeCell(resolveTileKey(draft, opened.tileset, each), flags));
      const next = seededRandom(random.seed);
      const indexes = placementIndexes(opened.tilemap, input.options);
      editLayerCells(draft, opened, (cells) => {
        for (const index of indexes) cells[index] = cellsOf[Math.floor(next() * cellsOf.length)] ?? 0;
      });
      return;
    }
    placeCells(draft, input.options, ({ tileset }) => {
      checkFlags(tileset, flags);
      return makeCell(resolveTileKey(draft, tileset, tile ?? 1), flags);
    });
  },
});

export { mapPaint };
