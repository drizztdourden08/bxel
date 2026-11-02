/* @layer renderer-app @kind logic */
import type { HoldContext } from '@drizztdourden08/brock-react';
import { useQuickPaletteStore } from '../../stores/useQuickPaletteStore';

const endQuickHold = (context: HoldContext): void => {
  const { release, close } = useQuickPaletteStore.getState();
  if (context.cause === 'keyup' || context.cause === 'run') {
    release();
    return;
  }
  close();
};

export { endQuickHold };
