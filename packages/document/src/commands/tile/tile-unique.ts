/* @layer core @kind logic */
import { cloneSprite } from '../../draft/clone-sprite';
import { editLayerCells } from '../../draft/edit-layer-cells';
import { registerRef } from '../../draft/register-ref';
import { requireSprite } from '../../read/require-sprite';
import { requireTile } from '../../read/require-tile';
import { tileUniqueSchema } from '../../schema/tile-unique-schema';
import { rekeyCell } from '../../tilemap/rekey-cell';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { cellIndex } from '../tilemap/cell-index';
import { openLayer } from '../tilemap/open-layer';
import { attachTile } from './attach-tile';
import { nextTileKey } from './next-tile-key';
import { placedKey } from './placed-key';
import { tileSpriteName } from './tile-sprite-name';

const tileUnique = defineCommand({
  name: COMMAND_NAME.tileUnique,
  scope: 'none',
  schema: tileUniqueSchema,
  run: (draft, input) => {
    const { options } = input;
    const opened = openLayer(draft, options);
    const indexes = options.cells.map((point, index) => cellIndex(opened.tilemap, point, `options.cells.${index}`));
    const source = requireTile(opened.tileset, placedKey(opened.layer.cells, indexes));
    const newKey = nextTileKey(opened.tileset);
    const taken = draft.artwork.sprites.map((sprite) => sprite.name);
    const name = tileSpriteName(options.name, taken, opened.tileset, newKey);
    const copy = cloneSprite(draft.ids, requireSprite(draft.artwork, source.spriteId), name, draft.stamp);
    attachTile(draft, opened.tileset, copy, source.collision);
    editLayerCells(draft, opened, (cells) => {
      for (const index of indexes) cells[index] = rekeyCell(cells[index] ?? 0, newKey);
    });
    registerRef(draft, input.ref, copy.id);
  },
});

export { tileUnique };
