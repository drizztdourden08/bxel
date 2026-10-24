/* @layer core @kind logic */
import type { ChangeSet } from '../commands/result.type';

const isEmptyChanges = (changes: ChangeSet): boolean =>
  !changes.artwork &&
  changes.banks.length === 0 &&
  changes.sprites.length === 0 &&
  changes.sheets.length === 0 &&
  changes.presets.length === 0 &&
  changes.tilesets.length === 0 &&
  changes.tilemaps.length === 0;

export { isEmptyChanges };
