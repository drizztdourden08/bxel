/* @layer core @kind logic */
import type { ChangeSet } from '../commands/result.type';

const emptyChanges = (): ChangeSet => ({ project: false, banks: [], sprites: [], sheets: [], presets: [] });

export { emptyChanges };
