/* @layer renderer-app @kind logic */
import { useQuickPaletteStore } from '../../stores/useQuickPaletteStore';
import { lastPointer } from './pointer-point';

const openQuickPalette = (): void => useQuickPaletteStore.getState().show(lastPointer());

export { openQuickPalette };
