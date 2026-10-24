/* @layer core @kind logic */
import { syncSheetOrder } from '../../draft/sync-sheet-order';
import { updateArtwork } from '../../draft/update-artwork';
import { spriteReorderSchema } from '../../schema/sprite-reorder-schema';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';

const spriteReorder = defineCommand({
  name: COMMAND_NAME.spriteReorder,
  scope: 'sprites',
  schema: spriteReorderSchema,
  run: (draft, input) => {
    const { to, by } = input.options;
    const moved = new Set(input.sprites);
    const group = draft.artwork.sprites.filter((sprite) => moved.has(sprite.id));
    const rest = draft.artwork.sprites.filter((sprite) => !moved.has(sprite.id));
    const first = draft.artwork.sprites.findIndex((sprite) => moved.has(sprite.id));
    const before = draft.artwork.sprites.slice(0, Math.max(0, first)).filter((sprite) => !moved.has(sprite.id)).length;
    const at = Math.min(rest.length, Math.max(0, to ?? before + (by ?? 0)));
    const order = [...rest.slice(0, at), ...group, ...rest.slice(at)];
    if (order.every((sprite, index) => sprite === draft.artwork.sprites[index])) return;
    updateArtwork(draft, (artwork) => ({ ...artwork, sprites: order }));
    syncSheetOrder(draft);
  },
});

export { spriteReorder };
