/* @layer core @kind logic */
import { assertNameFree, checkName } from '@bxel/document';
import type { Draft, PaletteBank } from '@bxel/document';
import { updateBank } from './update-bank';

const renameBank = (draft: Draft, bank: PaletteBank, requested: string): void => {
  const name = checkName(requested);
  assertNameFree(
    draft.artwork.banks.filter((other) => other.id !== bank.id).map((other) => other.name),
    name,
  );
  if (name === bank.name) return;
  updateBank(draft, bank.id, (current) => ({ ...current, name }));
};

export { renameBank };
