/* @layer core @kind logic */
import { movedOrder } from '../../draft/move-in-order';
import { reorderSheetEntries } from '../../draft/reorder-sheet-entries';
import { sameOrder } from '../../draft/same-order';
import { syncSheetOrder } from '../../draft/sync-sheet-order';
import { updateArtwork } from '../../draft/update-artwork';
import { spriteReorderSchema } from '../../schema/sprite-reorder-schema';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { pickSheet } from '../sheet/pick-sheet';

const spriteReorder = defineCommand({
  name: COMMAND_NAME.spriteReorder,
  scope: 'sprites',
  schema: spriteReorderSchema,
  run: (draft, input) => {
    const { to, by, sheet } = input.options;
    const moved = new Set(input.sprites);
    if (sheet) {
      reorderSheetEntries(draft, pickSheet(draft, sheet).id, moved, { to, by });
      return;
    }
    const order = movedOrder(draft.artwork.sprites, (sprite) => moved.has(sprite.id), { to, by });
    if (sameOrder(order, draft.artwork.sprites)) return;
    updateArtwork(draft, (artwork) => ({ ...artwork, sprites: [...order] }));
    syncSheetOrder(draft);
  },
});

export { spriteReorder };
