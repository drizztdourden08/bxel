/* @layer core @kind logic */
import { assertNameFree, checkName } from '@bxel/document';
import type { Draft, PaletteBank } from '@bxel/document';
import { uniqueBankName } from './unique-bank-name';

const bankCopyName = (draft: Draft, bank: PaletteBank, requested: string | undefined): string => {
  const name = requested === undefined ? uniqueBankName(draft.artwork, bank.name) : checkName(requested);
  assertNameFree(
    draft.artwork.banks.map((other) => other.name),
    name,
  );
  return name;
};

export { bankCopyName };
