/* @layer core @kind logic */
import { COMMAND_NAME, defineCommand, remapBank, requireBank } from '@bxel/document';
import type { BankId, Swatch } from '@bxel/document';
import { buildReorderTables } from '../build-reorder-tables';
import { checkOrder } from './check-order';
import { paletteReorderSchema } from './palette-reorder-schema';
import { updateBank } from './update-bank';

const paletteReorder = defineCommand({
  name: COMMAND_NAME.paletteReorder,
  scope: 'none',
  schema: paletteReorderSchema,
  run: (draft, input) => {
    const bankId = input.options.bankId as BankId;
    const bank = requireBank(draft.artwork, bankId);
    const indices = checkOrder(bank, input.options.order);
    if (indices.every((slot, position) => slot === position)) return;
    const { forward, inverse } = buildReorderTables(indices);
    remapBank(draft, { bankId, forward, inverse });
    const byId = new Map(bank.slots.map((slot) => [String(slot.id), slot] as const));
    const slots = input.options.order.flatMap((id): Swatch[] => {
      const slot = byId.get(id);
      return slot ? [slot] : [];
    });
    updateBank(draft, bankId, (current) => ({ ...current, slots }));
  },
});

export { paletteReorder };
