/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { CommandStep } from '@bxel/document';
import type { SnapChange } from './snap-plan.type';

const snapSteps = (changes: readonly SnapChange[]): CommandStep[] =>
  changes.map((change) => ({
    name: COMMAND_NAME.swatchUpdate,
    targets: null,
    options: { bankId: change.bankId, swatchId: change.swatchId, rgb: change.after, ...(change.rename ? { name: change.after } : {}) },
  }));

export { snapSteps };
