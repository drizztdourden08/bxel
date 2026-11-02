/* @layer renderer-app @kind logic */
import type { HoldContext } from '@drizztdourden08/brock-react';
import { cellAt } from './cell-at';
import { lastPointer } from './pointer-point';

const releaseQuickPalette = (context: HoldContext): void => {
  if (context.tap || context.cause !== 'keyup') return;
  cellAt(lastPointer())?.click();
};

export { releaseQuickPalette };
