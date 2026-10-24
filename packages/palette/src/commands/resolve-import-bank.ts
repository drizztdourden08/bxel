/* @layer core @kind logic */
import { ERROR_CODE, fail, findBank, requireBank } from '@bxel/document';
import type { BankId, Draft, PaletteBank } from '@bxel/document';
import type { ImportBank } from './sprite-import.type';

const resolveImportBank = (draft: Draft, target: ImportBank): PaletteBank => {
  if ('bankId' in target) return requireBank(draft.artwork, target.bankId as BankId);
  const id = draft.created[target.ref] as BankId | undefined;
  const bank = id === undefined ? undefined : findBank(draft.artwork, id);
  if (!bank) {
    throw fail(ERROR_CODE.TARGET_NOT_FOUND, `The ref "${target.ref}" does not name a palette bank made earlier in this transaction.`, {
      path: 'options.bank.ref',
    });
  }
  return bank;
};

export { resolveImportBank };
