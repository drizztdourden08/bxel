/* @layer core @kind logic */
import { registerRef } from '../../draft/register-ref';
import { tileAddSchema } from '../../schema/tile-add-schema';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { pickTileset } from '../tilemap/pick-tileset';
import { buildSprite } from '../sprite/build-sprite';
import { attachTile } from './attach-tile';
import { nextTileKey } from './next-tile-key';
import { tileSpriteName } from './tile-sprite-name';

const tileAdd = defineCommand({
  name: COMMAND_NAME.tileAdd,
  scope: 'none',
  schema: tileAddSchema,
  run: (draft, input) => {
    const tileset = pickTileset(draft, input.options.tileset);
    const key = nextTileKey(tileset);
    const taken = draft.artwork.sprites.map((sprite) => sprite.name);
    const name = tileSpriteName(input.options.name, taken, tileset, key);
    const base = buildSprite({
      ids: draft.ids,
      name,
      width: tileset.tileWidth,
      height: tileset.tileHeight,
      bankId: tileset.bankId,
      pivot: null,
      created: draft.stamp,
    });
    const sprite = { ...base, role: 'tile' as const };
    attachTile(draft, tileset, sprite);
    registerRef(draft, input.ref, sprite.id);
  },
});

export { tileAdd };
