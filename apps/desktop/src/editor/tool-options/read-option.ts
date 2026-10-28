/* @layer renderer-app @kind logic */
import { useToolStore } from '../../stores/useToolStore';
import type { OptionSpec, OptionValue } from './tool-options.type';

const readOption = (spec: OptionSpec): OptionValue => {
  const { tool, optionMemory } = useToolStore.getState();
  if (spec.memory === 'tool' && spec.tool !== tool) return optionMemory[spec.id] ?? spec.default;
  return spec.read();
};

export { readOption };
