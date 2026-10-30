/* @layer core @kind logic */
import type { CommandStep } from './transaction.type';

const plainStep = (name: string, options: unknown, ref?: string): CommandStep => ({
  name,
  targets: null,
  options,
  ...(ref === undefined ? {} : { ref }),
});

export { plainStep };
