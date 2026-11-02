/* @layer renderer-app @kind logic */
import type { CommandContext } from '@drizztdourden08/brock-react';

const slotOfArgs = (context?: CommandContext): number | null => {
  const args = context?.args;
  const slot = typeof args === 'object' && args !== null && 'slot' in args ? Number(args.slot) : Number.NaN;
  return Number.isInteger(slot) ? slot : null;
};

export { slotOfArgs };
