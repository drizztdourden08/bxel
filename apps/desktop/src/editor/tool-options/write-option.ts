/* @layer renderer-app @kind logic */
import { useToolStore } from '../../stores/useToolStore';
import type { OptionSpec, OptionValue } from './tool-options.type';

const writeOption = (spec: OptionSpec, value: OptionValue): void => {
  const { tool, optionMemory, loadOptionMemory } = useToolStore.getState();
  if (spec.memory === 'tool' && spec.tool !== tool) {
    loadOptionMemory({ ...optionMemory, [spec.id]: value });
    return;
  }
  spec.write(value);
};

export { writeOption };
