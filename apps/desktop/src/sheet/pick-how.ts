/* @layer renderer-app @kind logic */
import type { PickHow } from './sheet.type';

const pickHow = (event: { shiftKey: boolean; ctrlKey: boolean; metaKey: boolean }): PickHow | null => {
  if (event.shiftKey) return 'range';
  return event.ctrlKey || event.metaKey ? 'toggle' : null;
};

export { pickHow };
