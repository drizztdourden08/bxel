/* @layer renderer-app @kind logic */
import type { Sprite } from '@bxel/document';
import { nameError } from '../sprite-name/name-error';
import type { RenameEntry, RenamePlan } from './manager.type';

const buildRenamePlan = (targets: readonly Sprite[], finals: readonly string[], others: readonly string[]): RenamePlan => {
  const entries: RenameEntry[] = targets.map((sprite, index) => {
    const to = finals[index] ?? sprite.name;
    const taken = [...others, ...finals.filter((_name, at) => at !== index)];
    return { id: sprite.id, from: sprite.name, to, error: nameError(to, taken) };
  });
  const changed = entries.filter((entry) => entry.from !== entry.to).length;
  return { entries, changed, ok: changed > 0 && entries.every((entry) => entry.error === null) };
};

export { buildRenamePlan };
