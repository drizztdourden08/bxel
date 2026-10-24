/* @layer renderer-app @kind logic */
import { useToolStore } from '../stores/useToolStore';
import { currentTarget } from './current-target';

const stepColour = (direction: 1 | -1): void => {
  const target = currentTarget();
  if (!target) return;
  const count = target.bank.slots.length;
  const tools = useToolStore.getState();
  tools.setForeground((tools.foreground + direction + count) % count);
};

export { stepColour };
