/* @layer renderer-app @kind logic */
import { expandNamePattern } from '@bxel/document';
import type { Sprite } from '@bxel/document';
import { nameError } from '../sprite-name/name-error';
import type { RenameEntry, RenamePlan, RenameSpec } from './manager.type';

const finalName = (spec: RenameSpec, sprite: Sprite, index: number): string => {
  const found = spec.find.length === 0 ? sprite.name : sprite.name.split(spec.find).join(spec.replace);
  return expandNamePattern(spec.pattern, found, spec.start + index).trim();
};

const planRenames = (spec: RenameSpec, targets: readonly Sprite[], others: readonly string[]): RenamePlan => {
  const finals = targets.map((sprite, index) => finalName(spec, sprite, index));
  const entries: RenameEntry[] = targets.map((sprite, index) => {
    const to = finals[index] ?? sprite.name;
    const taken = [...others, ...finals.filter((_name, at) => at !== index)];
    return { id: sprite.id, from: sprite.name, to, error: nameError(to, taken) };
  });
  const changed = entries.filter((entry) => entry.from !== entry.to).length;
  return { entries, changed, ok: changed > 0 && entries.every((entry) => entry.error === null) };
};

export { planRenames };
