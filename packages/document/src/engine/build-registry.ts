/* @layer core @kind logic */
import type { CommandDef } from '../commands/command-def.type';

const buildRegistry = (commands: readonly CommandDef[]): ReadonlyMap<string, CommandDef> => {
  const registry = new Map<string, CommandDef>();
  for (const command of commands) {
    if (registry.has(command.name)) throw new Error(`Command "${command.name}" is registered twice.`);
    registry.set(command.name, command);
  }
  return registry;
};

export { buildRegistry };
