/* @layer core @kind logic */
import { FORMAT_VERSION } from '../container.constants';
import { MIGRATIONS } from './migrations.constants';
import type { Migration, MigrationInput } from './migration.type';

const migrate = (
  input: MigrationInput,
  from: number,
  migrations: readonly Migration[] = MIGRATIONS,
  target: number = FORMAT_VERSION,
): MigrationInput | null => {
  let current = input;
  let version = from;
  while (version < target) {
    const step = migrations.find((migration) => migration.from === version);
    if (!step) return null;
    current = step.up(current);
    version = step.to;
  }
  return current;
};

export { migrate };
