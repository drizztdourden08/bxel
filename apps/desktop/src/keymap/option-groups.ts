/* @layer renderer-app @kind logic */
import type { OptionSpec } from '../editor/tool-options/tool-options.type';

const commandIdOf = (spec: OptionSpec): string => spec.command ?? `options.${spec.id}`;

const optionGroups = (specs: readonly OptionSpec[]): [string, OptionSpec[]][] => {
  const groups = new Map<string, OptionSpec[]>();
  for (const spec of specs) groups.set(commandIdOf(spec), [...(groups.get(commandIdOf(spec)) ?? []), spec]);
  return [...groups];
};

export { optionGroups };
