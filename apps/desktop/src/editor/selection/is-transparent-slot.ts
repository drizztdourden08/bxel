/* @layer renderer-app @kind logic */
import type { PaletteBank } from '@bxel/document';

const isTransparentSlot = (bank: PaletteBank) => (index: number): boolean => bank.slots[index]?.kind === 'transparent';

export { isTransparentSlot };
