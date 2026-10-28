/* @layer renderer-app @kind logic */
import { optionById } from '../tool-options/option-by-id';
import { readOption } from '../tool-options/read-option';
import type { OptionValue } from '../tool-options/tool-options.type';

const snapshotFields = (ids: readonly string[]): Record<string, OptionValue> => {
  const fields: Record<string, OptionValue> = {};
  for (const id of ids) {
    const spec = optionById(id);
    if (spec) fields[id] = readOption(spec);
  }
  return fields;
};

export { snapshotFields };
