/* @layer renderer-app @kind logic */
import type { CommandContext } from '@drizztdourden08/brock-react';

const commandArgs = <T extends object>(context: CommandContext | undefined): Partial<T> => {
  const args = context?.args;
  return typeof args === 'object' && args !== null ? args : {};
};

export { commandArgs };
