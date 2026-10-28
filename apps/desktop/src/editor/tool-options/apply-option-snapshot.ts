/* @layer renderer-app @kind logic */
import { useToolStore } from '../../stores/useToolStore';
import { OPTION_SPECS } from './option-specs.constants';
import { stored } from './stored';
import type { OptionValue } from './tool-options.type';

const applyOptionSnapshot = (values: Readonly<Record<string, OptionValue>>): void => {
  const tools = useToolStore.getState();
  tools.loadOptionMemory(values);
  for (const spec of OPTION_SPECS.filter(stored)) {
    const value = values[spec.id];
    const live = spec.memory === 'global' || spec.tool === tools.tool;
    if (value !== undefined && live) spec.write(value);
  }
};

export { applyOptionSnapshot };
