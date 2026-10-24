/* @layer core @kind logic */
import type { ChangeSet } from '../commands/result.type';

const emptyChanges = (): ChangeSet => ({ artwork: false, banks: [], sprites: [], sheets: [], presets: [] });

export { emptyChanges };
