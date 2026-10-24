/* @layer renderer-app @kind logic */
import { COMMAND_NAME, nameKey } from '@bxel/document';
import type { CommandStep } from '@bxel/document';
import { spritesTarget } from '../sheet/sprites-target';
import { uniqueName } from '../sprite-name/unique-name';
import { TEMP_NAME } from './manager.constants';
import type { RenameEntry } from './manager.type';

const renameStep = (entry: Pick<RenameEntry, 'id'>, name: string): CommandStep => ({
  name: COMMAND_NAME.spriteUpdate,
  targets: spritesTarget([entry.id]),
  options: { name },
});

const shiftsIntoOldNames = (changing: readonly RenameEntry[]): boolean => {
  const old = new Set(changing.map((entry) => nameKey(entry.from)));
  return changing.some((entry) => old.has(nameKey(entry.to)));
};

const renameSteps = (entries: readonly RenameEntry[], existing: readonly string[]): CommandStep[] => {
  const changing = entries.filter((entry) => entry.from !== entry.to);
  if (!shiftsIntoOldNames(changing)) return changing.map((entry) => renameStep(entry, entry.to));
  const taken = [...existing, ...changing.map((entry) => entry.to)];
  const temps = changing.map((_entry, index) => uniqueName(`${TEMP_NAME}_${index}`, taken));
  return [
    ...changing.map((entry, index) => renameStep(entry, temps[index] ?? entry.to)),
    ...changing.map((entry) => renameStep(entry, entry.to)),
  ];
};

export { renameSteps };
