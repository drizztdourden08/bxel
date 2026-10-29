/* @layer core @kind logic */
import { updateTileset } from '../../draft/update-tileset';
import type { Tileset } from '../../model/tilemap.type';
import { requireTile } from '../../read/require-tile';
import { tileLayout } from '../../read/tile-layout';
import { tilesetLayoutSchema } from '../../schema/tileset-layout-schema';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { pickTileset } from '../tilemap/pick-tileset';

const moved = (indexOf: Map<number, number>, key: number, to: number): void => {
  const from = indexOf.get(key);
  const other = [...indexOf].find(([, index]) => index === to)?.[0];
  indexOf.set(key, to);
  if (other !== undefined && other !== key && from !== undefined) indexOf.set(other, from);
};

const tilesetLayout = defineCommand({
  name: COMMAND_NAME.tilesetLayout,
  scope: 'none',
  schema: tilesetLayoutSchema,
  run: (draft, input) => {
    const { columns, move } = input.options;
    const tileset = pickTileset(draft, input.options.tileset);
    for (const step of move ?? []) requireTile(tileset, step.key);
    const indexOf = new Map(tileLayout(tileset).indexOf);
    for (const step of move ?? []) moved(indexOf, step.key, step.to);
    updateTileset(
      draft,
      tileset.id,
      (current): Tileset => ({
        ...current,
        columns: columns ?? current.columns ?? tileLayout(current).columns,
        tiles: current.tiles.map((tile) => ({ ...tile, layout: indexOf.get(tile.key) ?? tile.layout })),
      }),
    );
  },
});

export { tilesetLayout };
