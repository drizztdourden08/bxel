/* @layer core @kind logic */
import type { ChangeSet } from '../commands/result.type';

const isEmptyChanges = (changes: ChangeSet): boolean =>
  !changes.project &&
  changes.banks.length === 0 &&
  changes.sprites.length === 0 &&
  changes.sheets.length === 0 &&
  changes.presets.length === 0;

export { isEmptyChanges };
