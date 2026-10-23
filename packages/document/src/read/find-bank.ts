/* @layer core @kind logic */
import type { BankId } from '../model/ids.type';
import type { PaletteBank } from '../model/palette.type';
import type { Project } from '../model/project.type';

const findBank = (project: Project, id: BankId): PaletteBank | undefined =>
  project.banks.find((bank) => bank.id === id);

export { findBank };
