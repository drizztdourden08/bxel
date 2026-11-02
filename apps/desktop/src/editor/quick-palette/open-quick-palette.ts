/* @layer renderer-app @kind logic */
import type { CommandContext } from '@drizztdourden08/brock-react';
import { useQuickPaletteStore } from '../../stores/useQuickPaletteStore';
import { lastPointer } from './pointer-point';

const openQuickPalette = (context?: CommandContext): void => useQuickPaletteStore.getState().show(lastPointer(), context?.trigger === 'keyboard');

export { openQuickPalette };
