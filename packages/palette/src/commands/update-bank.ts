/* @layer core @kind logic */
import { updateProject } from '@bxel/document';
import type { BankId, Draft, PaletteBank } from '@bxel/document';

const updateBank = (draft: Draft, bankId: BankId, change: (bank: PaletteBank) => PaletteBank): void => {
  updateProject(draft, (project) => ({
    ...project,
    banks: project.banks.map((bank) => (bank.id === bankId ? change(bank) : bank)),
  }));
};

export { updateBank };
