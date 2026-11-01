/* @layer renderer-app @kind logic */
import type { PaletteBank } from '@bxel/document';
import { paletteSlots } from '../editor/palette-slots';

const hexesOf = (bank: PaletteBank, indices: readonly number[]): string[] => {
  const slots = paletteSlots(bank);
  return indices.map((index) => slots[index]?.hex ?? '');
};

export { hexesOf };
