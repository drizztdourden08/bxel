/* @layer core @kind logic */
import { ERROR_CODE } from '../commands/error-code.constants';
import { fail } from '../commands/fail';
import type { BankId } from '../model/ids.type';
import type { PaletteBank } from '../model/palette.type';
import type { Project } from '../model/project.type';
import { findBank } from './find-bank';

const requireBank = (project: Project, id: BankId): PaletteBank => {
  const bank = findBank(project, id);
  if (!bank) throw fail(ERROR_CODE.TARGET_NOT_FOUND, `Palette bank ${id} does not exist.`);
  return bank;
};

export { requireBank };
